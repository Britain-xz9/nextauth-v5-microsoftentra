import mongoose from "mongoose";

// mongodb uri
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

// mongoose cache interface
type ConnectionCache = {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
};

// global declaration for mongoose connection cache
declare global {
  var mongooseConnections: {
    main: ConnectionCache;
  };
}

// initialize connection cache if does not exist
if (!global.mongooseConnections) {
  global.mongooseConnections = { main: { conn: null, promise: null } };
}

// connect to mongoDB
export default async function connectDB(): Promise<mongoose.Connection> {
  // initialize cache
  const cache = global.mongooseConnections.main;

  // if connection exists and is ready, return
  if (cache.conn && cache.conn.readyState === 1) {
    return cache.conn;
  }

  // if connection promise is in progress, await
  if (!cache.promise) {
    // options
    const opts = {
      bufferCommands: false, // disable mongoose buffering
      maxPoolSize: 10, // maintain up to 10 socket connections
      minPoolSize: 1, // maintain at least 1 socket connection
      serverSelectionTimeoutMS: 5000, // keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // close sockets after 45 seconds of inactivity
      family: 4, // use IPv4, skip trying IPv6
      connectTimeoutMS: 10000, // give up initial connection after 10 seconds
    };

    // create new connection promise
    cache.promise = mongoose
      .connect(MONGODB_URI as string, opts)
      .then((mongoose) => {
        console.log("MongoDB connected successfully.");
        return mongoose.connection;
      });
  }

  try {
    // await for connection promise
    cache.conn = await cache.promise;

    // add connection event listeners
    if (cache.conn) {
      // remove existing listeners to avoid duplication
      cache.conn.removeAllListeners("error");
      cache.conn.removeAllListeners("disconnected");

      // handle connection errors
      cache.conn.on("error", (err) => {
        console.error("MongoDB connection error: ", err);
        cache.conn = null;
        cache.promise = null;
      });

      // handle disconnection
      cache.conn.on("disconnected", () => {
        console.log("MongoDB disconnected.");
        cache.conn = null;
        cache.promise = null;
      });
    }

    // return
    return cache.conn;
  } catch (error) {
    // reset cache on failure
    cache.conn = null;
    cache.promise = null;
    console.error("MongoDB connection failed: ", error);
    throw error;
  }
}
