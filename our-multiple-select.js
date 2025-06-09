class OurMultipleSelect {
    constructor(id) {
        this.elementTarget = document.getElementById(id);

        if (!this.elementTarget) {
            throw new Error(`Elemento com ID "${id}" não encontrado.`);
        }

        this.elementTargetOptions = this.elementTarget.options;

        this.init();
    }

    // Método principal que inicializa o componente
    init() {
        this.elementTarget.classList.add("multiple-select-target");

        this.multipleSelect = document.createElement("div");
        this.multipleSelect.classList.add("multiple-select");

        this.multipleSelectHeader = document.createElement("div");
        this.multipleSelectHeader.classList.add("multiple-select__header");

        this.multipleSelectDropdown = document.createElement("div");
        this.multipleSelectDropdown.classList.add("multiple-select__dropdown");

        this.multipleSelect.append(this.multipleSelectHeader, this.multipleSelectDropdown);

        this.elementTarget.parentElement.insertBefore(this.multipleSelect, this.elementTarget.nextSibling);

        this.createOptions();

        this.multipleSelectHeader.addEventListener("click", () => {
            document.documentElement.style.setProperty("--oms-dropdown-width", `${this.multipleSelect.offsetWidth}px`);

            this.multipleSelect.toggleAttribute("open");
        });
    }

    createOptions() {
        for (let i = 0; i < this.elementTargetOptions.length; i++) {
            const option = this.elementTargetOptions[i];

            const optionItem = document.createElement("div");
            optionItem.classList.add("oms-option");

            const optionCheckbox = document.createElement("input");
            optionCheckbox.setAttribute("id", `oms-option-${i}`);
            optionCheckbox.setAttribute("type", "checkbox");
            optionCheckbox.classList.add("oms-option-checkbox");

            const optionLabel = document.createElement("label");
            optionLabel.setAttribute("for", `oms-option-${i}`);
            optionLabel.classList.add("oms-option-label");
            optionLabel.textContent = option.text;

            optionItem.append(optionCheckbox, optionLabel);

            this.multipleSelectDropdown.append(optionItem);

            optionItem.addEventListener("change", () => {
                let arr = [];

                this.multipleSelectDropdown.querySelectorAll(".oms-option-checkbox[type=checkbox]:checked")
                    .forEach((a) => {
                        arr.push(a.nextElementSibling.textContent);
                    });

                if (arr.length >= 3) {
                    this.multipleSelectHeader.innerHTML = `<span>${arr.length} selecionados(as)</span>`;
                } else {
                    this.multipleSelectHeader.innerHTML = `<span>${arr.join(", ")}</span>`;
                }
            });
        }
    }
}

// TODO: adicionar evento para fechar o dropdown ao clicar fora
document.addEventListener("click", function (e) {
});

const example = new OurMultipleSelect("example");