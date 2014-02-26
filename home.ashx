<%@ WebHandler Language="C#" Class="server" %>

using System;
using System.Web;
using System.Text;
using System.Collections.Generic;
using System.Collections.Specialized;

public class server : IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        NameValueCollection query = context.Request.QueryString;
        string callback = query["callback"];
        Dictionary<string, string> data = new Dictionary<string, string>();
        switch (query["action"].ToLower())
        {
            case "setserver":
                {
                    data["ret"] = "'success'";
                    data["act"] = "'setserver'";
                    ProcessReturn(context, callback, data);
                    break;
                }
            case "getgames":
                {
                    StringBuilder sb = new StringBuilder("[");
                    foreach (KeyValuePair<string, Dictionary<string, string>> pair in Store)
                    {
                        if (pair.Value == null)
                            sb.Append("'" + pair.Key + "',");
                    }
                    string ret = sb.ToString();
                    if (ret.Length > 1)
                        ret = ret.Remove(ret.Length - 1);
                    ret += "]";

                    data["ret"] = ret;
                    data["act"] = "'getgames'";
                    ProcessReturn(context, callback, data);
                    break;
                }
            case "newgame":
                {
                    string gamename = query["name"].ToLower();
                    if (Store.ContainsKey(gamename))
                    {
                        data["ret"] = "'exist'";
                    }
                    else
                    {
                        Store.Add(gamename, null);
                        data["ret"] = "'ok'";
                    }
                    data["act"] = "'newgame'";
                    ProcessReturn(context, callback, data);
                    break;
                }
            case "joingame":
                {
                    string gamename = query["name"].ToLower();
                    if (!Store.ContainsKey(gamename))
                        data["ret"] = "'nogame'";
                    else if (Store[gamename] != null)
                        data["ret"] = "'occupy'";
                    else if (Store[gamename] == null)
                    {
                        data["ret"] = "'ok'";
                        Store[gamename] = new Dictionary<string, string>();
                    }
                    data["act"] = "'joingame'";
                    ProcessReturn(context, callback, data);
                    break;
                }
            case "listenisbegin":
                {
                    string gamename = query["name"].ToLower();
                    if (Store.ContainsKey(gamename) && Store[gamename] != null)
                        data["ret"] = "'ok'";
                    else
                        data["ret"] = "'wait'";
                    data["act"] = "'listenisbegin'";
                    ProcessReturn(context, callback, data);
                    break;
                }
            case "move":
                {
                    string gamename = query["name"].ToLower();
                    string camp = query["camp"].ToLower();

                    Dictionary<string, string> description = Store[gamename];
                    description[camp] = query["posA"] + "_" + query["posB"];

                    data["ret"] = "'ok'";
                    data["act"] = "'move'";
                    ProcessReturn(context, callback, data);
                    break;
                }
            case "regretask":
                {
                    string gamename = query["name"].ToLower();
                    string camp = query["camp"].ToLower();

                    Dictionary<string, string> description = Store[gamename];
                    description[camp + "regretask"] = "true";

                    data["ret"] = "'ok'";
                    data["act"] = "'regretask'";
                    ProcessReturn(context, callback, data);
                    break;
                }
            case "regretans":
                {
                    string gamename = query["name"].ToLower();
                    string camp = query["camp"].ToLower();
                    string ans = query["ans"].ToLower();

                    Dictionary<string, string> description = Store[gamename];
                    description[camp + "regretans"] = ans;

                    data["ret"] = "'ok'";
                    data["act"] = "'regretans'";
                    ProcessReturn(context, callback, data);
                    break;
                }
            case "listencommand":
                {
                    data["act"] = "'listencommand'";
                    string gamename = query["name"].ToLower();
                    string camp = query["camp"].ToLower();

                    if (Store.ContainsKey(gamename))
                    {
                        Dictionary<string, string> description = Store[gamename];
                        string enemyCamp = "black";
                        if (camp == "black")
                            enemyCamp = "red";

                        if (description.ContainsKey(enemyCamp))//move
                        {
                            string val = description[enemyCamp];
                            data["ret"] = "'ok'";
                            data["cmd"] = "'move'";
                            data["posA"] = "'" + val.Split('_')[0] + "'";
                            data["posB"] = "'" + val.Split('_')[1] + "'";
                            description.Remove(enemyCamp);
                            ProcessReturn(context, callback, data);
                        }
                        else if (description.ContainsKey(enemyCamp + "regretask"))//regretask
                        {
                            data["ret"] = "'ok'";
                            data["cmd"] = "'regretask'";
                            description.Remove(enemyCamp + "regretask");
                            ProcessReturn(context, callback, data);
                        }
                        else if (description.ContainsKey(enemyCamp + "regretans"))//regretans
                        {
                            data["ret"] = "'ok'";
                            data["cmd"] = "'regretans'";
                            data["ans"] = description[enemyCamp + "regretans"];
                            description.Remove(enemyCamp + "regretans");
                            ProcessReturn(context, callback, data);
                        }
                        else
                        {
                            data["ret"] = "'wait'";
                            ProcessReturn(context, callback, data);
                        }
                    }
                    data["ret"] = "'nogame'";
                    ProcessReturn(context, callback, data);
                    break;
                }
            case "gameover":
                {
                    string gamename = query["name"].ToLower();
                    if (Store.Remove(gamename))
                        data["act"] = "'gameOver_true'";
                    else
                        data["act"] = "'gameOver_false'";
                    data["ret"] = "'ok'";
                    ProcessReturn(context, callback, data);
                    break;
                }
            case "reset":
                {
                    context.Application.Remove("store");
                    data["ret"] = "'ok'";
                    data["act"] = "'reset'";
                    ProcessReturn(context, callback, data);
                    break;
                }
        }
    }

    void ProcessReturn(HttpContext context, string callback, Dictionary<string, string> data)
    {
        StringBuilder sb = new StringBuilder(callback);
        sb.Append("({");
        foreach (KeyValuePair<string, string> pair in data)
        {
            sb.Append("'" + pair.Key + "':");
            sb.Append(pair.Value + ",");
        }
        string ret = sb.ToString();
        ret = ret.Remove(ret.Length - 1);
        ret += "});";
        context.Response.ContentType = "text/javascript";
        context.Response.Write(ret);
        context.Response.End();
    }

    public Dictionary<string, Dictionary<string, string>> Store
    {
        get
        {
            if (HttpContext.Current.Application["store"] == null)
            {
                Dictionary<string, Dictionary<string, string>> store = new Dictionary<string, Dictionary<string, string>>();
                HttpContext.Current.Application["store"] = store;
            }
            return HttpContext.Current.Application["store"] as Dictionary<string, Dictionary<string, string>>;
        }
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}

