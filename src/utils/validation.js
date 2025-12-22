const { isStrongPassword, isEmail, isMobilePhone } = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password, mobileNo, skills } = req.body;

//   console.log(firstName, lastName);

  if (!firstName || !lastName) {
    throw new Error("Enter first name and last name");
  } else if (firstName.length < 3 || firstName.length > 20) {
    throw new Error("Length of first name must be between 3 and 30 characters");
  } else if (lastName.length < 3 || lastName.length > 20) {
    throw new Error("Length of last name must be between 3 and 30 characters");
  } else if (!isEmail(emailId)) {
    throw new Error("Email ID is not valid");
  } else if (!isStrongPassword(password)) {
    throw new Error("Password is too weak");
  } else if (!isMobilePhone(String(mobileNo || ""))) {
    throw new Error("Mobile number is not valid");
  }
};
const validateEditProfileData = (req) => {
    const validEditFields = ["firstName", "lastName", "gender", "age", "skills", "password","photoURL"];

    const isEditAllowed=Object.keys(req.body).every(field => validEditFields.includes(field));
    return isEditAllowed;

}

module.exports = { validateSignupData,validateEditProfileData };
