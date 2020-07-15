module.exports.validateUserInfoInput = (username, password) => {
    const errors = {};
    if (username.trim() === '') {
        errors.username = "Username cannot be empty";
    }
    if (password.trim() === '') {
        errors.password = "Password cannot be empty";
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}
