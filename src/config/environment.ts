export interface EnvVariables {
  port: number;
  nodeEnv: NodeEnv;
  saltRounds: number;
  jwtAccessTokenSecret: string;
  jwtRefreshTokenSecret: string;
}

const envVariables: EnvVariables = {
  port: parseInt(process.env.PORT || "8080"),
  nodeEnv: process.env.NODE_ENV || "development",
  saltRounds: parseInt(process.env.SALT_ROUNDS || "10"),
  jwtAccessTokenSecret:
    process.env.JWT_ACCESS_TOKEN_SECRET ||
    "4027c5f50a502fe83226c2ac917090fe0e6818936593dbb537d95e872204c4a8",
  jwtRefreshTokenSecret:
    process.env.JWT_REFRESH_TOKEN_SECRET ||
    "a6d9ebbbafc4504976c389e774f5d8cc3a92351bbcaf41e07981544e5661df41",
};

export default envVariables;
