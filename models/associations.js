import { Course } from "./courses.js";
import { User } from "./users.js";
import { Path } from "./paths.js";
import { UserPath } from "./user-paths.js";
import { UserCourse } from "./user-courses.js";
import { Evidence } from "./evidence.js";

// User-Course Many-to-Many association through UserCourse
User.belongsToMany(Course, { through: UserCourse, foreignKey: '_id_user', otherKey: '_id_course' });
Course.belongsToMany(User, { through: UserCourse, foreignKey: '_id_course', otherKey: '_id_user' });

// User-Path Many-to-Many association through UserPath
User.belongsToMany(Path, { through: UserPath, foreignKey: '_id_user', otherKey: '_id_path' });
Path.belongsToMany(User, { through: UserPath, foreignKey: '_id_path', otherKey: '_id_user' });

// Assuming associations might also be needed for the Evidence
User.hasMany(Evidence, { foreignKey: '_id_user' });
Evidence.belongsTo(User, { foreignKey: '_id_user' });

Course.hasMany(Evidence, { foreignKey: '_id_course' });
Evidence.belongsTo(Course, { foreignKey: '_id_course' });

Path.hasMany(Course, { foreignKey: '_id_path' });
Course.belongsTo(Path, { foreignKey: '_id_path' });
