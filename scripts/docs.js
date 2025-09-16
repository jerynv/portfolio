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
                        console.log("key>>>", item[key]);
                        this.createCodeSnippet(item[key].type, item[key].data, item[key].name);
                        break;
                    case "text":
                        this.createText(item[key]);
                        break;
                    case "title":
                        this.createTitle(item[key]);
                        break;
                    case "description":
                        this.createDescription(item[key]);
                        break;
                    case "label":
                        this.createLabel(item[key]);
                        break;
                    case "smallLabel":
                        this.createSmallLabel(item[key]);
                        break;
                    case "list":
                        this.createList(item[key]);
                        break;
                    case "image":
                        this.createImage(item[key].src, item[key].size);
                        break;
                    case "link":
                        this.createText(`<a href="${item[key].href}" target="_blank" rel="noopener">${item[key].text}</a>`, 'html');
                        break;
                    default:
                        console.log("no key found");
                        break;
                }
            }
        }
        this.render();
    }

    createCodeSnippet(language, code, replacementName) {
        const formattedCode = js_beautify(code, {
            indent_size: 2,
        });
        const element = document.createElement("div");
        const options = document.createElement("div");
        const copyButton = document.createElement("span");
        const languageText = document.createElement("span");
        languageText.textContent = replacementName || language;
        copyButton.textContent = "Copy";
        options.appendChild(languageText);
        options.appendChild(copyButton);
        element.appendChild(options);
        const pre = document.createElement("pre");
        const codeElement = document.createElement("code");

        copyButton.addEventListener("click", () => {
            if (
                copyButton.textContent === "Copied" ||
                copyButton.textContent === "Once more?"
            ) {
                copyButton.textContent = "Once more?";
            } else {
                navigator.clipboard.writeText(formattedCode).then(() => {
                    copyButton.textContent = "Copied";
                    setTimeout(() => {
                        copyButton.textContent = "Copy";
                    }, 5000);
                }).catch(err => {
                    console.error("Clipboard copy failed:", err);
                });
            }
        });
        copyButton.classList.add("copy-button");
        options.classList.add("code-snippet-info");
        element.classList.add("code-snippet");
        codeElement.classList.add("language-" + language);
        codeElement.textContent = formattedCode;

        pre.appendChild(codeElement);
        element.appendChild(pre);
        //when scrolled down or up inside the code box ripple the event up to the parent
        this.content.appendChild(element);

        hljs.highlightElement(codeElement);
    }

    createTitle(text) {
        const element = document.createElement("h1");

        element.innerHTML = text;
        this.content.appendChild(element);
    }

    createLabel(text) {
        const element = document.createElement("h2");

        element.classList.add("label");
        element.innerHTML = text;
        this.content.appendChild(element);
    }

    createSmallLabel(text) {
        const element = document.createElement("h2");

        element.classList.add("small-label");
        element.innerHTML = text;
        this.content.appendChild(element);
    }

    createDescription(text) {
        const element = document.createElement("p");

        element.classList.add("description");
        element.innerHTML = text;
        this.content.appendChild(element);
    }

    createText(text, type = 'text') {
        const element = document.createElement("p");

        element.classList.add("doc-content-text");
        if (type === 'html') {
            element.innerHTML = text;
        } else {
            element.innerText = text;
        }
        this.content.appendChild(element);
    }

    createList(list) {
        const element = document.createElement("ul");

        for (const item of list) {
            const listItem = document.createElement("li");
            listItem.innerHTML = item;
            element.appendChild(listItem);
        }

        element.classList.add("doc-content-list");

        this.content.appendChild(element);
    }

    createImage(src, size) {
        const div = document.createElement("div");
        div.classList.add("doc-image-container");
        this.content.appendChild(div);
        const img = document.createElement("img");
        img.src = src;
        img.classList.add("doc-image");
        img.style.maxWidth = size;
        div.appendChild(img);
    }


    render() {
        this.parent.appendChild(this.content);
        //scroll to top of the page
        this.parent.scrollTo({ top: 0, behavior: "smooth" });
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
        this.parent.tabIndex = 0;
        //for every key in object create a new element with the key as the text and every child as a child div
        const element = document.createElement("div");
        element.classList.add("tree-element");
        for (const key in this.obj) {
            const icon = document.createElement("svg");
            icon.innerHTML = `<svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 7C12.2652 7 12.5196 7.10536 12.7071 7.29289L19.7071 14.2929C20.0976 14.6834 20.0976 15.3166 19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071L12 9.41421L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L11.2929 7.29289C11.4804 7.10536 11.7348 7 12 7Z" fill="currentColor"></path> </g></svg>`;
            const text = document.createElement("p");
            const element_base = document.createElement("div");
            element_base.classList.add("tree-base");
            //completly remove the tab inde
            element_base.removeAttribute("tabindex");
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
                        // const treeChildren = item.querySelectorAll(
                        //     ".tree-child"
                        // );
                        // for (const child of treeChildren) {
                        //     child.removeAttribute("tabindex");
                        // }
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
                    handleChildClick.call(this);
                });

                childElement.addEventListener("keydown", (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        handleChildClick.call(this);
                    }
                });

                function handleChildClick() {//set active for this element and remove for element in the entire scope of tree-element
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
                }
            }

            //now for accesibility add keyboard navigation to the tree base
            // element_base.addEventListener("keydown", (e) => {
            //     if (e.key === "Enter" || e.key === " ") {
            //         e.preventDefault();
            //         text.click();
            //     } else if (e.key === "ArrowDown") {
            //         e.preventDefault();
            //         const next = element_base.nextElementSibling;
            //         if (next) {
            //             next.querySelector("p").focus();
            //         }
            //     } else if (e.key === "ArrowUp") {
            //         e.preventDefault();
            //         const prev = element_base.previousElementSibling;
            //         if (prev) {
            //             prev.querySelector("p").focus();
            //         }
            //     }
            // });

            element_base.appendChild(childrenTree);
            element.appendChild(element_base);
        }

        //when the user hits and acessibility key to fous down onto the tree have the first tree-base focused and then the user can navigate with arrow keys and or tab and let them be able to jump out of the tree with tab
        //get all the tree-base elements
        const treeBases = element.querySelectorAll(".tree-base");
        this.parent.addEventListener("keydown", (e) => {
            //let default hapen first before we do anything

            if ((e.key === "Enter" || e.key === " ") && !e.shiftKey) {
                if (e.target.closest('.tree-base')) return; //dont do anything if the user is already focused on a tree base
                // the tree-base has a focus of -1 i want to chane all of those if the user hits space or enter on the parent element
                for (const treeBase of treeBases) {
                    treeBase.tabIndex = 0;

                    treeBase.addEventListener("focus", () => {
                        //when a user focuses on a tree base check if it has a class of active if so set all its children abIndexes to 0 becaue we know its now open
                        if (treeBase.querySelector(".tree-child-container").classList.contains("active")) {
                            const treeChildren = treeBase.querySelectorAll(
                                ".tree-child"
                            );
                            for (const child of treeChildren) {
                                child.tabIndex = 0;
                            }
                        }
                    });

                    treeBase.addEventListener("keydown", (e) => {
                        // const all tree-child elements


                        if (e.key !== "Enter" && e.key !== " ") return;
                        if (e.target.closest('.tree-child')) return; //dont do anything if the user is already focused on a tree base

                        treeBase.querySelector("p").click();

                        const treeChildren = treeBase.querySelectorAll(
                            ".tree-child"
                        );


                        //check if the treebase is now active
                        if (
                            treeBase.querySelector(".tree-child-container").classList.contains("active") &&
                            treeChildren.length > 0
                        ) {
                            //focus the first child element
                            for (const child of treeChildren) {
                                child.tabIndex = 0;
                            }
                        } else {
                            //if its not active then focus back on the tree base
                            for (const child of treeChildren) {
                                child.removeAttribute("tabindex");;
                            }
                            treeBase.focus();
                        }
                    });

                    treeBase.addEventListener("focusout", (e) => {
                        //if the user focuses out of the tree-base and its children then set all tree-base tabIndex to -1
                        console.log("focusout", e.relatedTarget);
                        const treeChildren = treeBase.querySelectorAll(
                            ".tree-child"
                        );


                        //have to check that the related target is not the last child of the current tree base
                        if (treeBase.contains(e.relatedTarget)

                        ) return; //dont do anything if the user is still focused inside the tree base or its children

                        console.log("setting tabIndex to -1");
                        for (const child of treeChildren) {

                            child.removeAttribute("tabindex");
                        }
                    });
                }
                treeBases[0].focus();
            }
        });

        this.parent.addEventListener("focus", (e) => {
            //if the user focuses on the parent element and the target is not a child of the tree element then set all tree-base tabIndex to -1
            if (!e.target.closest(".tree-element")) {
                for (const treeBase of treeBases) {
                    treeBase.removeAttribute("tabindex");;
                }
            }
        });

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
            text.tabIndex = 0;
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

    forceOpen(name, page) {
        // visually open the dropdown aswell for the selected open
        const parts = name.split("/").map(p => p.trim().toLowerCase());
        console.log("parts", parts);

        let currentBase = document; // start from the whole document

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];

            // find the matching <p> inside the current tree level
            const node = document.evaluate(
                `.//p[contains(translate(text(), "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "${part}")]`,
                currentBase,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;

            if (!node) {
                console.warn("Part not found:", part);
                break;
            }

            // open the dropdown (tree-child-container) at this level
            const container = node.parentElement.querySelector(".tree-child-container, .nested-tree-child-container");
            if (container) {
                container.classList.add("active");
            }

            // If this is the last part → mark as active page
            if (i === parts.length - 1) {
                // node.parentElement.classList.add("active");
            }

            // set base for next iteration (so it searches inside the opened node)
            currentBase = node.parentElement;
        }

        const pageElement = document.evaluate(`//div[contains(@class, "tree-child")]/text()[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "${page.toLowerCase()}")]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        console.log('pageElement', pageElement);
        if (pageElement) {
            pageElement.parentElement.classList.add("active");
        }

        this.load(name, page);
    }

    render() {
        this.parent.appendChild(this.content);
    }
}

const docs_template = {
    tree: {
        "Documentation": {
            children: {
                intro: { page: "intro" },
                development: { page: "development" },
                contribute: { page: "contribute" },
            },
        },
        "pollchat hack": {
            children: {
                "the hack": {
                    page: "thehack",
                },
                "fixes": { page: "fixes" },
            },
        },
        "Ios Eq bridge": {
            children: {
                thoughts: { page: "thoughts" },
                development: { page: "development" },
                usage: { page: "usage" },
            },
        },
        "Tennis notifier": {
            children: {
                development: { page: "development" },
                notifier: { page: "notifier" }
            },
        },
    },
    load_path: "../pages/components/docs/",
};

const docController = new Documentaion(".output");
const docs = new Docs(docs_template, ".tree", docController);
docs.init();
docs.render();
docs.forceOpen("Documentation", "intro");
