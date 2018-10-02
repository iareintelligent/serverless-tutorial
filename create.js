import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamoDb-lib";
import { success, failure } from "./libs/response-lib";

AWS.config.update({ region: "us-east-2" });
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function main(event, context, callback) {
    const data = JSON.parse(event.body);
    const params = {
        TableName: "Events",
        Item: {
            userId: event.requestContext.identity.cognitoIdentityId,
            noteId: uuid.v1(),
            content: data.content,
            attachment: data.attachment,
            createdAt: Date.now()
        }
    };

    try {
        await dynamoDbLib.call("put", params);
        callback(null, success(params.Item));
    } catch (e) {
        console.log("error my dude", e);
        callback(null, failure({ status: false }));
    }
}
