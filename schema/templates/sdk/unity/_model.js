using System;
using SimpleJSON;
using UnityEngine;

[Serializable]
public class Model<%= capSchemaName %> {

    public string _id;

    public string createdAt;
    public string updatedAt;

    <% schemaFields.forEach(function(field, index) { %> 
	public string <%= field.split(':')[0].trim() %>; <% }) %>

    public Model<%= capSchemaName %>() {}

    public Model<%= capSchemaName %>(JSONNode data) {
        this._id = data["_id"];

        this.createdAt = data["createdAt"];
        this.updatedAt = data["updatedAt"];

		<% schemaFields.forEach(function(field, index) { %> 
		this.<%= field.split(':')[0].trim() %> = data["<%= field.split(':')[0].trim() %>"]; <% }) %>
    }

    public string ToJSON() {
        //return JsonUtility.ToJson(this);
        JSONNode data = JSON.Parse("{}");

		<% schemaFields.forEach(function(field, index) { %> 
		data["<%= field.split(':')[0].trim() %>"] = this.<%= field.split(':')[0].trim() %>; <% }) %>
	
        return data.ToString();
    }

}

[Serializable]
public class Model<%= capSchemaName %>FileUpload {
    public string file;

    public Model<%= capSchemaName %>FileUpload(JSONNode data) {
        this.file = data["file"];
    }
}
