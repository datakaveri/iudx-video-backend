-- schema.sql

-- Make sure it's `vs_db` database
\c vs_db;

CREATE TABLE IF NOT EXISTS "Users" 
(
  "id"                 UUID         NOT NULL,
  "name"               TEXT         NOT NULL,
  "email"              TEXT         NOT NULL,
  "password"           TEXT         NOT NULL,
  "salt"               TEXT,
  "verificationCode"   TEXT,
  "verified"           BOOLEAN,
  "role"               TEXT,
  "approved"           BOOLEAN,
  "createdAt"          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  "updatedAt"          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE ("email"),
  PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Cameras" 
(
  "cameraId"            UUID,
  "userId"              UUID          NOT NULL,
  "cameraNum"           INTEGER       NOT NULL,
  "cameraName"          TEXT          NOT NULL,
  "cameraType"          TEXT,
  "cameraUsage"         TEXT,
  "cameraOrientation"   TEXT,
  "city"                TEXT,
  "location"            TEXT,
  "createdAt"           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  "updatedAt"           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("cameraId"),
  CONSTRAINT "userFK"
      FOREIGN KEY ("userId") 
	  REFERENCES "Users" ("id")
);

CREATE TABLE IF NOT EXISTS "Streams" 
(
  "streamId"              UUID,
  "userId"                UUID          NOT NULL,
  "cameraId"              UUID          NOT NULL,
  "provenanceStreamId"    UUID          NOT NULL,
  "sourceServerId"        UUID          NOT NULL,
  "destinationServerId"   UUID          NOT NULL,
  "processId"             INTEGER,
  "type"                  TEXT          NOT NULL,
  "streamName"            TEXT          NOT NULL,
  "streamUrl"             TEXT          NOT NULL,
  "streamType"            TEXT          NOT NULL,
  "isPublic"              BOOLEAN,
  "isActive"              BOOLEAN,
  "isPublishing"          BOOLEAN,
  "isStable"              BOOLEAN,
  "totalClients"          INTEGER,
  "codec"                 TEXT,
  "resolution"            TEXT,
  "frameRate"             INTEGER,
  "bandwidthIn"           BIGINT,
  "bandwidthOut"          BIGINT,
  "bytesIn"               BIGINT,
  "bytesOut"              BIGINT,
  "activeTime"            INTEGER,
  "lastActive"            TIMESTAMPTZ,
  "createdAt"             TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  "updatedAt"             TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("streamId"),
  CONSTRAINT "userFK"
      FOREIGN KEY ("userId") 
	  REFERENCES "Users" ("id"),
  CONSTRAINT "cameraFK"
      FOREIGN KEY ("cameraId") 
	  REFERENCES "Cameras" ("cameraId")    
);

CREATE TABLE IF NOT EXISTS "Archives" 
(
  "fileId"              UUID,
  "userId"              UUID        NOT NULL,
  "streamId"            UUID        NOT NULL,
  "fileName"            TEXT        NOT NULL,
  "fileSize"            TEXT,
  "fileDuration"        INTEGER,
  "createdDate"         TIMESTAMP,
  PRIMARY KEY ("fileId"),
  CONSTRAINT "userFK"
      FOREIGN KEY ("userId") 
	  REFERENCES "Users" ("id"),
  CONSTRAINT "streamFK"
      FOREIGN KEY("streamId") 
	  REFERENCES "Streams" ("streamId")
);

CREATE TABLE IF NOT EXISTS "Policies" 
(
  "policyId"            UUID,
  "userId"              UUID        NOT NULL,
  "streamId"            UUID,
  "providerId"          UUID,
  "createdAt"           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  "updatedAt"           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("policyId"),
  CONSTRAINT "userFK"
      FOREIGN KEY ("userId") 
	  REFERENCES "Users" ("id"),
  CONSTRAINT "streamFK"
      FOREIGN KEY("streamId") 
	  REFERENCES "Streams" ("streamId"),
  CONSTRAINT "userFK2"
      FOREIGN KEY("providerId") 
	  REFERENCES "Users" ("id")
);