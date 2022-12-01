import { user } from "../db_user.js";


user.forAll(user => {
    user.firstName = 'H'
})
