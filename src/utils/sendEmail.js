// utils/sendEmail.js
exports.sendVerificationEmail = ({ email, code, purpose }) => {
  console.log(`
[EMAIL 인증]
email: ${email}
purpose: ${purpose}
code: ${code}
(5분 이내 입력)
`);
};
