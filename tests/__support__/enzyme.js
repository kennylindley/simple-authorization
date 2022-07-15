let Adapter = require("enzyme-adapter-react-16");
let { configure } = require("enzyme");

configure({ adapter: new Adapter() });
