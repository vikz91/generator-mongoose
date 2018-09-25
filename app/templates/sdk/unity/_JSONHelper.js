using System;
using UnityEngine;
using System.Reflection;
using SimpleJSON;
using System.Collections.Generic;

public static class JSONHelper {
    public static Vector3 ToVector3(this JSONNode data) {
        return new Vector3(data["x"].AsFloat, data["y"].AsFloat, data["z"].AsFloat);
    }

    public static T Deserialize < T > (this JSONNode data) {
        Type[] argTypes = new Type[] {
            typeof (JSONNode)
        };
        object[] argValues = new object[] {
            data
        };
        ConstructorInfo ctor = typeof (T).GetConstructor(argTypes);
        return (T) ctor.Invoke(argValues);
    }

    public static List < T > DeserializeList < T > (this JSONArray data) {
        List < T > list = new List < T > ();

        foreach(JSONNode j in data) {
            list.Add(j.Deserialize < T > ());
        }

        return list;
    }

    public static string Serialize < T > (this T t, string JSONSerialization = "ToJSON") {
        Type thisType = t.GetType();
        MethodInfo method = thisType.GetMethod(JSONSerialization);
        return "{\"data\":" + method.Invoke(t, null) + "}";
    }

}
