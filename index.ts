import {app} from "./common/app";
import {config} from './config/app'
import "./routes/employees";

app.listen(config.PORT, () => {
    console.log(`Listening on http://localhost:${config.PORT}`);
});