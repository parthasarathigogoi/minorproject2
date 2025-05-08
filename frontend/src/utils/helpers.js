// Format date
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };
  
  // Get user role display name
  export const getRoleDisplayName = (role) => {
    const roles = {
      student: 'Student',
      teacher: 'Teacher',
      admin: 'Administrator'
    };
    return roles[role] || role;
  };
  
  // Check if user has required role
  export const hasRole = (user, requiredRole) => {
    return user?.role === requiredRole;
  };