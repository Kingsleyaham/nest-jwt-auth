export const MESSAGES = {
  // Success Messages
  CREATED: 'The Record has been created successfully',
  UPDATED: 'The Record has been updated successfully',
  DELETED: 'The Record has been deleted successfully',
  LOGOUT_SUCCESS: 'Logout successful',
  UPLOAD_SUCCESS: 'The Record has been uploaded successfully',
  PASSWORD_TOKEN_SENT: 'Password reset token sent successfully',
  PASSWORD_RESET_SUCCESS: 'Password was reset successfully',
  EMAIL_VERIFICATION_SENT: 'Email verification link sent successfully',
  EMAIL_VERIFICATION_SUCCESS: 'Email verified successfully',

  // Error Messages
  INVALID_ID: 'invalid ObjectId',
  USER_ALREADY_EXIST: 'user already exist',
  USER_NOT_FOUND: 'user not found',
  INVALID_EMAIL_PWD: 'Invalid email or password',
  UNAUTHENTICATED: 'Access Denied. Unauthorized to access resource',
  INVALID_TOKEN: 'Access Denied. Invalid Access Token provided',
  INVALID_EXPIRED_TOKEN: 'Invalid or expired token provided',
  EMPLOYEE_ALREADY_EXIST: 'Employee already exist',
  EMPLOYEE_NOT_FOUND: 'Employee does not exist',
  NO_EMPLOYEES: 'Employees record is empty',
  USER_UNVERIFIED:
    'Kindly click the link sent to your email to verify your account',
  EMPTY_UPDATE_OBJECT: 'please provide field(s) to update',
  STRONG_PASSWORD:
    'password must be atleeast 8 character, and also contain at least one uppercase, lowercase, symbol and number',
  ERROR_OCCURED: 'an error occured',
  LOGOUT_ERROR: 'an error occured logging out',
};

export const USER_GROUP = 'user_returned_details';
