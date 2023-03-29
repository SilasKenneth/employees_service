import { logger } from "./common/logger";
import bcrypt from "bcrypt";
import { config } from "./config/app";
import { User } from "./models/user";

export const createDefaultUser = async () => {
    logger.info("Creating default user.ts.");
    const hashedPass = await bcrypt.hash(config.DEFAULT_APP_USER_PASSWORD, 10);
    const data = {
        username: config.DEFAULT_APP_USERNAME,
        email: config.DEFAULT_APP_USER_EMAIL,
        password: hashedPass,
    };
    logger.info(data);
    const [defaultUser, _] = await User.findOrBuild({
        where: {
            username: data.username,
        },
    });
    defaultUser.set(data);
    defaultUser
        .save()
        .then((response) => {
            logger.info("Successfully created the default account.");
        })
        .catch((exception) => {
            logger.log(
                "debug",
                `Error occurred creating the default user! ${exception.message}`,
            );
        });
};
