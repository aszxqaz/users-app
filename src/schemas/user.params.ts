import { Transform } from "class-transformer";
import { CustomIsInt, CustomIsNotEmpty, CustomMin } from "./decorators";

export class UserParams {
    @Transform(({ value }) => parseInt(value, 10))
    @CustomMin(1)
    @CustomIsInt()
    @CustomIsNotEmpty()
    userId: number;
}
