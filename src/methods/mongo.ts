import {
  Db,
  InsertOneResult,
  MongoClient,
  ObjectId,
  UpdateResult,
} from "mongodb";

const DB_URI: string = process.env.MONGO_URI || "mongodb://localhost:27017";
const DB_NAME: string = process.env.MONGO_DBNAME || "vakyavahan";

export enum CollectionName {
  client = "client",
  messages = "messages",
}

/**
 * DBHandler Class is basic wrapper for MongoDB connection, making interacting with MongoDB easier in this app.
 * @author Paurush Sinha
 */
class DBHandler {
  private connection: MongoClient;
  private connectedDb: Db;

  constructor() {
    this.connection = new MongoClient(DB_URI);
    this.connectedDb = this.connection.db(DB_NAME);
  }

  /**
   * newDocument: This method inserts new document into the MongoDB.
   * @author Paurush Sinha
   * @param collectionName Destination Collection Name in which the document will store.
   * @param document Document to store in the connection
   * @param closeConnection Accepts Boolean, true if you want to close the DB Connection after the execution.
   * @returns ObjectID of the created document. If null is returned, then the document was not created as an exception must have occured.
   */
  async newDocument(
    collectionName: CollectionName,
    document: Object,
    closeConnection?: boolean
  ): Promise<ObjectId | null> {
    const collection = this.connectedDb.collection(collectionName);
    let insertedID: ObjectId | null = null;
    try {
      const response: InsertOneResult = await collection.insertOne(document);
      insertedID = response.insertedId;
    } finally {
      if (closeConnection) this.close();
      return insertedID;
    }
  }

  /**
   * Deletes one record.
   * @param collectionName Name of the collection delete the document from
   * @param filter Filter to select the document to delete
   * @param closeConnection Optional, if you want to close the DB Connection after the execution of the deletion.
   * @returns Boolean, true if the collection deleted else false.
   */
  async deleteRecord(
    collectionName: CollectionName,
    filter: Object,
    closeConnection?: boolean
  ): Promise<boolean> {
    const collection = this.connectedDb.collection(collectionName);
    const response = await collection.deleteOne(filter);

    if (closeConnection) this.close();

    return response.acknowledged;
  }

  /**
   * Updates one record from the collection
   * @param collectionName Collection Name
   * @param filter Filter to select the target document
   * @param setObject Update to implement in the document
   * @param closeConnection Optional Boolean, true if you want to close the connection after updation.
   * @author Paurush Sinha
   * @returns Boolean, true if success.
   */
  async updateRecord(
    collectionName: CollectionName,
    filter: Object,
    setObject: Object,
    closeConnection?: boolean
  ): Promise<boolean> {
    const collection = this.connectedDb.collection(collectionName);
    let response: UpdateResult | null = null;
    try {
      response = await collection.updateOne(filter, { $set: setObject });
    } finally {
      if (closeConnection) this.close();
      return response?.acknowledged ?? false;
    }
  }

  async select(
    collectionName: CollectionName,
    filter: Object,
    closeConnection?: boolean
  ) {
    const collection = this.connectedDb.collection(collectionName);
    const result = await collection.findOne(filter);
    if (closeConnection) this.close();
    return result;
  }

  close() {
    this.connection.close();
  }
}
export default DBHandler;
