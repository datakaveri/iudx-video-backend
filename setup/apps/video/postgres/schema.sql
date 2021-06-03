-- schema.sql
 -- DROP DATABASE IF EXISTS vs_db;

 -- CREATE DATABASE vs_db;

-- Make sure it's `vs_db` database
\c vs_db;

CREATE TABLE IF NOT EXISTS "Users" (
  "id" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "salt" TEXT,
  "verificationCode" TEXT,
  "verified" BOOLEAN,
  "role" TEXT,
  "lastLogin" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE ("email"),
  PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Servers" (
  "serverId" SERIAL,
  "serverName" TEXT NOT NULL,
  "serverType" TEXT NOT NULL,
  "serverUrl" TEXT NOT NULL,
  "status" TEXT,
  "totalPublishers" INTEGER,
  "totalClients" INTEGER,
  UNIQUE ("serverName"),
  PRIMARY KEY ("serverId")
);

CREATE TABLE IF NOT EXISTS "Cameras" (
  "cameraId" SERIAL,
  "userId" UUID NOT NULL,
  "serverId" INTEGER,
  "cameraNum" INTEGER NOT NULL,
  "cameraName" TEXT NOT NULL,
  "streamName" TEXT,
  "streamUrl" TEXT,
  "cameraType" TEXT,
  "cameraUsage" TEXT,
  "cameraOrientation" TEXT,
  "city" TEXT,
  "location" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("cameraId"),
  CONSTRAINT "userCameraUQ" 
      UNIQUE("userId", "cameraName"),
  CONSTRAINT "userFK"
      FOREIGN KEY ("userId") 
	  REFERENCES "Users" ("id"),
  CONSTRAINT "serverFK"
      FOREIGN KEY ("serverId") 
	  REFERENCES "Servers" ("serverId")
);

CREATE TABLE IF NOT EXISTS "Streams" (
  "streamId" SERIAL,
  "userId" UUID,
  "cameraId" INTEGER,
  "sourceServerId" INTEGER,
  "destinationServerId" INTEGER,
  "processId" INTEGER,
  "streamName" TEXT NOT NULL,
  "streamUrl" TEXT NOT NULL,
  "streamType" TEXT NOT NULL,
  "access" TEXT,
  "role" TEXT,
  "totalClients" INTEGER,
  "active" BOOLEAN DEFAULT false,
  "publishing" BOOLEAN DEFAULT false,
  "stable" BOOLEAN DEFAULT false,
  "lastActive" TIMESTAMPTZ,
  UNIQUE ("streamUrl"),
  PRIMARY KEY ("streamId"),
  CONSTRAINT "userFK"
      FOREIGN KEY ("userId") 
	  REFERENCES "Users" ("id"),
  CONSTRAINT "cameraFK"
      FOREIGN KEY ("cameraId") 
	  REFERENCES "Cameras" ("cameraId"),
  CONSTRAINT "sourceServerFK"
      FOREIGN KEY ("sourceServerId") 
	  REFERENCES "Servers" ("serverId"),
  CONSTRAINT "destinationServerFK"
      FOREIGN KEY ("destinationServerId") 
	  REFERENCES "Servers" ("serverId")    
);

CREATE TABLE IF NOT EXISTS "Archives" (
  "fileId" SERIAL,
  "userId" UUID,
  "streamId" INTEGER,
  "fileName" TEXT NOT NULL,
  "fileSize" TEXT,
  "fileDuration" INTEGER,
  "createdDate" TIMESTAMP,
  UNIQUE ("fileName"),
  PRIMARY KEY ("fileId"),
  CONSTRAINT "userFK"
      FOREIGN KEY ("userId") 
	  REFERENCES "Users" ("id"),
  CONSTRAINT "streamFK"
      FOREIGN KEY("streamId") 
	  REFERENCES "Streams" ("streamId")
);