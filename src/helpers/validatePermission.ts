const validatePermission = (permissionName: string, permissions: any[]) => {
  return permissions.some((permission) => permission.name === permissionName);
};

export default validatePermission;
