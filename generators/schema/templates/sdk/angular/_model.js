export class Model<%= capSchemaName %> {
    _id: string;

    <% schemaFields.forEach(function(field, index) { %> 
		<%= field.split(':')[0].trim() %> : <%= field.split(':')[1].trim() %>;  <% }) %>
}
