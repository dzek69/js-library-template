import os from "os";

/**
 * Returns "howdy" followed by given name and os platform
 *
 * @param {string} [name="stranger"] - name of person to greet
 * @returns {string} - greeting
 */
const howdy = (name = "stranger") => "howdy " + name + " on " + os.platform();

export default howdy;
