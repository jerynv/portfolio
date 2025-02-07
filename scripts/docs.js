class Documentaion {
    //take in a json of the documentation with titles and other information in a list representing a vertical layout of the documentation
    constructor(selector) {
        this.content = document.createElement("div");
        this.parent = document.querySelector(selector);
    }

    init(obj) {
        //the obj is a list of objects and i want to check each one for keys and value like  key "codeSnippet" and it will create html element with the key as the functions and the value as the content
        for (const item of obj) {
            for (const key in item) {
                switch (key) {
                    case "codeSnippet":
                        this.createCodeSnippet(item[key]);
                        break;
                    case "text":
                        this.createText(item[key]);
                        break;
                    case "title":
                        this.createTitle(item[key]);
                        break;
                    case "list":
                        this.createList(item[key]);
                        break;
                    case "image":
                        this.createImage(item[key]);
                        break;
                    default:
                        console.log("no key found");
                        break;
                }
            }
        }
        this.render();
    }

    createCodeSnippet(code) {
        const element = document.createElement("div");
        element.classList.add("code-snippet");
        element.innerHTML = code;
        this.content.appendChild(element);
    }

    createTitle(text) {
        const element = document.createElement("h1");
        element.innerHTML = text;
        this.content.appendChild(element);
    }

    render() {
        this.parent.appendChild(this.content);
    }

    destroy() {
        this.content.innerHTML = "";
    }
}

class Docs {
    constructor(obj, selector, doc_controller) {
        this.obj = obj.tree;
        this.load_path = obj.load_path;
        this.load_extension = obj.load_extension;
        this.content = ``;
        this.parent = document.querySelector(selector);
        this.doc_controller = doc_controller;
    }

    init() {
        //for every key in object create a new element with the key as the text and every child as a child div
        const element = document.createElement("div");
        element.classList.add("tree-element");
        for (const key in this.obj) {
            const icon = document.createElement("svg");
            icon.innerHTML = `<svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 7C12.2652 7 12.5196 7.10536 12.7071 7.29289L19.7071 14.2929C20.0976 14.6834 20.0976 15.3166 19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071L12 9.41421L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L11.2929 7.29289C11.4804 7.10536 11.7348 7 12 7Z" fill="currentColor"></path> </g></svg>`;
            const text = document.createElement("p");
            const element_base = document.createElement("div");
            element_base.classList.add("tree-base");
            text.innerHTML = key;
            text.appendChild(icon.firstChild);
            text.addEventListener("click", () => {
                element_base
                    .querySelector(".tree-child-container")
                    .classList.toggle("active");
                const active = document.querySelectorAll(
                    ".tree-child-container.active"
                );
                for (const item of active) {
                    if (
                        item !==
                        element_base.querySelector(".tree-child-container")
                    ) {
                        item.classList.remove("active");
                    }
                }
            });
            element_base.appendChild(text);
            const childrenTree = document.createElement("div");
            childrenTree.classList.add("tree-child-container");
            //console log the children but not in alphabetical order

            for (const child in this.obj[key].children) {
                const childElement = document.createElement("div");
                const childText = document.createTextNode(child);
                if (this.obj[key].children[child].children) {
                    //console.log("nesting");
                    childElement.appendChild(
                        this.nest(this.obj[key].children[child], child, key)
                    );
                    childrenTree.appendChild(childElement);
                    continue;
                } else {
                    childElement.classList.add("tree-child");
                    childElement.appendChild(childText);
                }
                childrenTree.appendChild(childElement);
                childElement.addEventListener("click", () => {
                    //set active for this element and remove for element in the entire scope of tree-element
                    const active =
                        document.querySelectorAll(".tree-child.active");
                    for (const item of active) {
                        if (item !== childElement) {
                            item.classList.remove("active");
                        }
                    }
                    childElement.classList.toggle("active");
                    //and the parent element name under the tree key
                    this.load(key, this.obj[key].children[child].page);
                });
            }
            element_base.appendChild(childrenTree);
            element.appendChild(element_base);
        }
        this.content = element;
    }

    nest(obj, name, masterName) {
        //just create a minature dropdown to append to a dropdown
        const element = document.createElement("div");
        element.classList.add("nested-tree-element");

        for (const key in obj) {
            //console.log(key, " --key");
            const icon = document.createElement("svg");
            icon.innerHTML = `<svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 7C12.2652 7 12.5196 7.10536 12.7071 7.29289L19.7071 14.2929C20.0976 14.6834 20.0976 15.3166 19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071L12 9.41421L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L11.2929 7.29289C11.4804 7.10536 11.7348 7 12 7Z" fill="currentColor"></path> </g></svg>`;
            const text = document.createElement("p");
            const element_base = document.createElement("div");
            element_base.classList.add("nested-tree-base");
            text.innerHTML = name;
            text.appendChild(icon.firstChild);
            text.addEventListener("click", () => {
                element_base
                    .querySelector(".nested-tree-child-container")
                    .classList.toggle("active");
                const active = document.querySelectorAll(
                    ".nested-tree-child-container.active"
                );
                for (const item of active) {
                    if (
                        item !==
                        element_base.querySelector(
                            ".nested-tree-child-container"
                        )
                    ) {
                        item.classList.remove("active");
                    }
                }
            });
            element_base.appendChild(text);
            const childrenTree = document.createElement("div");
            childrenTree.classList.add("nested-tree-child-container");
            //console log the children but not in alphabetical order

            for (const child in obj[key]) {
                //console.log("child");
                const childElement = document.createElement("div");
                const childText = document.createTextNode(child);
                childElement.classList.add("tree-child");
                childElement.appendChild(childText);
                childrenTree.appendChild(childElement);
                childElement.addEventListener("click", () => {
                    //set active for this element and remove for element in the entire scope of tree-element
                    const active =
                        document.querySelectorAll(".tree-child.active");
                    for (const item of active) {
                        if (item !== childElement) {
                            item.classList.remove("active");
                        }
                    }
                    childElement.classList.toggle("active");
                    //console.log(masterName+name, child);
                    this.load(`${masterName}/${name}`, child);
                });
            }
            element_base.appendChild(childrenTree);
            element.appendChild(element_base);
        }
        return element;
    }

    async load(parentName, page) {
        parentName = parentName.replace(/\s/g, "").toLowerCase();
        page = page.replace(/\s/g, "").toLowerCase();
        let response = await fetch(
            `${this.load_path}${parentName}/${page}.json`
        );
        try {
            response = await response.json();
        } catch (e) {
            console.log("error loading json", e);
        }
        this.doc_controller.destroy();
        this.doc_controller.init(response);
    }

    render() {
        this.parent.appendChild(this.content);
    }
}

const docs_template = {
    tree: {
        "pollchat hack": {
            children: {
                intro: {
                    page: "intro",
                },
                navbhar: {
                    children: {
                        exponents: { page: "Navbar" },
                        Headers: { page: "Headers" },
                    },
                },
                navbar: {
                    children: {
                        exponents: { page: "Navbar" },
                        Headers: { page: "Headers" },
                    },
                },
                navbear: {
                    children: {
                        exponents: { page: "Navbar" },
                        Headers: { page: "Headers" },
                    },
                },
                footer: { page: "Footer" },
            },
        },
        "pollchat hack2": {
            children: {
                intro: {
                    children: {
                        exponents: { page: "Navbar" },
                        Headers: { page: "Headers" },
                    },
                },
                navbhar: {
                    children: {
                        exponents: { page: "Navbar" },
                        Headers: { page: "Headers" },
                    },
                },
                navbar: {
                    children: {
                        exponents: { page: "Navbar" },
                        Headers: { page: "Headers" },
                    },
                },
                navbear: {
                    children: {
                        exponents: { page: "Navbar" },
                        Headers: { page: "Headers" },
                    },
                },
                footer: { page: "Footer" },
            },
        },
    },
    load_path: "../pages/components/docs/",
};

const docController = new Documentaion(".output");
const docs = new Docs(docs_template, ".tree", docController);
docs.init();
docs.render();
