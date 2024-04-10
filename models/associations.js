import { Course } from "./courses.js";
import { User } from "./users.js";
import { Path } from "./paths.js";
import { Progress } from "./progress.js";
import { UserPath } from "./user-paths.js";
import { UserCourse } from "./user-courses.js";

// User-Course Many-to-Many association through UserCourse
User.belongsToMany(Course, { through: UserCourse, foreignKey: '_id_user', otherKey: '_id_course' });
Course.belongsToMany(User, { through: UserCourse, foreignKey: '_id_course', otherKey: '_id_user' });

// User-Path Many-to-Many association through UserPath
User.belongsToMany(Path, { through: UserPath, foreignKey: '_id_user', otherKey: '_id_path' });
Path.belongsToMany(User, { through: UserPath, foreignKey: '_id_path', otherKey: '_id_user' });

// User-Progress One-to-Many association 
User.hasMany(Progress, { foreignKey: '_id_user' });
Progress.belongsTo(User, { foreignKey: '_id_user' });

// Course-Progress One-to-Many association
Course.hasMany(Progress, { foreignKey: '_id_course' });
Progress.belongsTo(Course, { foreignKey: '_id_course' });





