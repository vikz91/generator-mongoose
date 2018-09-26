using UnityEngine;
using System.Threading.Tasks;
using UnityEngine.Networking;
using System.Text;
using System.IO;
using System;
using SimpleJSON;

public class Server {

    public Server(string host) {
        this.Host = host;
        this.jwtToken = string.Empty;

        isInit = true;
    }

    bool isInit;


    public string Host {
        get;
        private set;
    }

    public string jwtToken;

    public int basicTimeout = 60;
    public int extendedTimeout = 1800;


    public void Init(string host) {
        if (string.IsNullOrEmpty(host)) {
            throw new System.Exception("Host must be non empty");
        }

        if (!isInit) {
            this.Host = host;
            this.jwtToken = string.Empty;


            isInit = true;
        }

    }

    # region === [CORE] ===

        #region Basic

    public async Task < HttpRes > Get(string endpoint) {
        string hitUrl = this.GetApiUrl(endpoint);

        using(UnityWebRequest www = UnityWebRequest.Get(hitUrl)) {
            if (!string.IsNullOrEmpty(jwtToken)) {
                www.SetRequestHeader("Authorization", jwtToken);
            }
            www.timeout = basicTimeout;

            await www.SendWebRequest();


            if (www.isNetworkError || www.isHttpError || www.responseCode >= 400) {
                return new HttpRes(true, www.error);
            }

            return new HttpRes(false, www.downloadHandler.text);

        }
    }

    public async Task < HttpRes > Post(string endpoint, string body = null) {
        string hitUrl = this.GetApiUrl(endpoint);

        using(UnityWebRequest www = new UnityWebRequest(hitUrl, "POST")) {
            byte[] uData = Encoding.UTF8.GetBytes(body);

            UploadHandlerRaw uH = new UploadHandlerRaw(uData);
            www.uploadHandler = uH;
            www.SetRequestHeader("Content-Type", "application/json");

            DownloadHandlerBuffer dH = new DownloadHandlerBuffer();
            www.downloadHandler = dH;

            if (!string.IsNullOrEmpty(jwtToken)) {
                www.SetRequestHeader("Authorization", jwtToken);
            }

            www.timeout = extendedTimeout;
            await www.SendWebRequest();

            return www.isNetworkError || www.isHttpError || www.responseCode >= 400 ?
                new HttpRes(true, www.error) :
                new HttpRes(false, www.downloadHandler ? .text);
        }

    }

    public async Task < HttpRes > Put(string endpoint, string body = null) {
        string hitUrl = this.GetApiUrl(endpoint);

        using(UnityWebRequest www = new UnityWebRequest(hitUrl, "PUT")) {
            byte[] uData = Encoding.UTF8.GetBytes(body);

            UploadHandlerRaw uH = new UploadHandlerRaw(uData);
            www.uploadHandler = uH;
            www.SetRequestHeader("Content-Type", "application/json");

            DownloadHandlerBuffer dH = new DownloadHandlerBuffer();
            www.downloadHandler = dH;


            www.SetRequestHeader("X-HTTP-Method-Override", "PUT");
            if (!string.IsNullOrEmpty(jwtToken)) {
                www.SetRequestHeader("Authorization", jwtToken);
            }

            www.timeout = extendedTimeout;
            await www.SendWebRequest();


            return www.isNetworkError || www.isHttpError || www.responseCode >= 400 ?
                new HttpRes(true, www.error) :
                new HttpRes(false, www.downloadHandler ? .text);
        }
    }

    public async Task < HttpRes > Delete(string endpoint) {
        string hitUrl = this.GetApiUrl(endpoint);

        using(UnityWebRequest www = UnityWebRequest.Delete(hitUrl)) {
            if (!string.IsNullOrEmpty(jwtToken)) {
                www.SetRequestHeader("Authorization", jwtToken);
            }

            www.timeout = extendedTimeout;
            await www.SendWebRequest();

            return www.isNetworkError || www.isHttpError || www.responseCode >= 400 ?
                new HttpRes(true, www.error) :
                new HttpRes(false, www.downloadHandler ? .text);
        }
    }

    # endregion


    # region Download File
    public async Task < Texture > GetTexture(string endpoint) {
        string hitUrl = this.GetApiUrl(endpoint);

        UnityWebRequest www = UnityWebRequestTexture.GetTexture(hitUrl);
        if (!string.IsNullOrEmpty(jwtToken)) {
            www.SetRequestHeader("Authorization", jwtToken);
        }

        www.timeout = extendedTimeout;
        await www.SendWebRequest();

        return (www.isNetworkError || www.isHttpError) ? null : DownloadHandlerTexture.GetContent(www);
    }


    public async Task < byte[] > GetFile(string endpoint) {
        string hitUrl = this.GetApiUrl(endpoint);
        UnityWebRequest www = UnityWebRequest.Get(hitUrl);
        if (!string.IsNullOrEmpty(jwtToken)) {
            www.SetRequestHeader("Authorization", jwtToken);
        }

        www.timeout = extendedTimeout;
        await www.SendWebRequest();


        return (www.isNetworkError || www.isHttpError) ? null : www.downloadHandler.data;
    }

    # endregion


    # region Upload File

    public async Task < HttpRes > PostFile(string endpoint, string filePath, string field = "file") {
        string hitUrl = this.GetApiUrl(endpoint);

        WWWForm wwwFormData = new WWWForm();
        wwwFormData.AddBinaryData(field, File.ReadAllBytes(filePath));

        using(UnityWebRequest www = UnityWebRequest.Post(hitUrl, wwwFormData)) {
            if (!string.IsNullOrEmpty(jwtToken)) {
                www.SetRequestHeader("Authorization", jwtToken);
            }
            www.timeout = extendedTimeout;

            await www.SendWebRequest();


            return www.isNetworkError || www.isHttpError || www.responseCode >= 400 ?
                new HttpRes(true, www.error) :
                new HttpRes(false, www.downloadHandler.text);
        }
    }


    public async Task < HttpRes > PostImage(string endpoint, string imagePath, string field = "image") {
        return await PostFile(endpoint, imagePath, field);
    }

    # endregion


    # endregion


    # region === [Utils] ===

        public string GetApiUrl(string data) {
            //Debug.Log("Hitting: " + this.Host + NormalizeEndpointRoute(data));
            return this.Host + NormalizeEndpointRoute(data);
        }

    public string NormalizeEndpointRoute(string data) {
        if (string.IsNullOrEmpty(data)) return "/";

        string str = data[0] != '/' ? "/" + data : data;
        str = str.Trim();

        return str;
    }#
    endregion

}


public class HttpRes {

    public bool err;
    public JSONNode data;
    public byte[] blobData;
    public string msg;
    public int status;


    public HttpRes(bool err, string data, byte[] blobData = null, string msg = "", int status = 200) {
        this.err = err;
        this.data = JSON.Parse(FixJsonData(data));
        this.blobData = blobData;
        this.msg = msg;
        this.status = status;
    }

    public string FixJsonData(string data) {
        if (string.IsNullOrEmpty(data))
            return "{}";

        return data[0] != '{' ? "{\"data\":\"" + data + "\"}" : data;
    }

}

public class ListOptions {
    public int skip = 0;
    public int limit = 100;
    public int sort = 0; //-1 desc, 1 asc, 0 neutral
}

[Serializable]
public class ApiResponse < T > {
    public string status;
    public T data;
    public string message;
}
