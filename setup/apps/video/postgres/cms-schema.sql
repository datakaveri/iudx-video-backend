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

CREATE TABLE IF NOT EXISTS "Servers" 
(
  "serverId"          UUID,
  "serverName"        TEXT         NOT NULL,
  "serverHost"        TEXT         NOT NULL,
  "serverRtmpPort"    INTEGER      NOT NULL,
  "serverType"        TEXT         NOT NULL,
  "upstreamTopic"     TEXT         NOT NULL,
  "downstreamTopic"   TEXT         NOT NULL,  
  "consumerGroupId"   TEXT         NOT NULL,
  "createdAt"         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  "updatedAt"         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),  
  PRIMARY KEY ("serverId")
);

CREATE TABLE IF NOT EXISTS "Cameras" 
(
  "cameraId"            UUID,
  "userId"              UUID          NOT NULL,
  "serverId"            UUID          NOT NULL,
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
	  REFERENCES "Users" ("id"),
  CONSTRAINT "serverFK"
      FOREIGN KEY ("serverId") 
	  REFERENCES "Servers" ("serverId") 
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
  "lastAccessed"          TIMESTAMPTZ,
  "lastActive"            TIMESTAMPTZ,
  "createdAt"             TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  "updatedAt"             TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("streamId", "destinationServerId"),
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

CREATE TABLE IF NOT EXISTS "Archives" 
(
  "fileId"              UUID,
  "userId"              UUID        NOT NULL,
  "streamId"            UUID        NOT NULL,
  "serverId"            UUID        NOT NULL,
  "fileName"            TEXT        NOT NULL,
  "fileSize"            TEXT,
  "fileDuration"        INTEGER,
  "createdDate"         TIMESTAMP,
  PRIMARY KEY ("fileId"),
  CONSTRAINT "userFK"
      FOREIGN KEY ("userId") 
	  REFERENCES "Users" ("id"),
  CONSTRAINT "streamServerFK"
      FOREIGN KEY("streamId", "serverId") 
	  REFERENCES "Streams" ("streamId", "destinationServerId")
);

CREATE TABLE IF NOT EXISTS "Policies" 
(
  "policyId"            UUID,
  "userId"              UUID        NOT NULL,
  "cameraId"            UUID,
  "providerId"          UUID,
  "createdAt"           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  "updatedAt"           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("policyId"),
  CONSTRAINT "userFK"
      FOREIGN KEY ("userId") 
	  REFERENCES "Users" ("id"),
  CONSTRAINT "cameraFK"
      FOREIGN KEY("cameraId") 
	  REFERENCES "Cameras" ("cameraId"),
  CONSTRAINT "userFK2"
      FOREIGN KEY("providerId") 
	  REFERENCES "Users" ("id")
);