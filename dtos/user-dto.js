const userDto = (userModel) => {
  return {
    email: userModel.email,
    id: userModel._id,
    isActive: userModel.isActive,
  }
}

module.exports = userDto;