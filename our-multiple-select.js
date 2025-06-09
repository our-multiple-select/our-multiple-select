class OurMultipleSelect {
    constructor(id) {
        this.id = id;
        this.elementTarget = document.getElementById(id);

        if (!this.elementTarget) {
            throw new Error(`Elemento com ID "${id}" não encontrado.`);
        }

        // Remove instância anterior caso existir
        const existing = document.getElementById(`multiple-select#${id}`);
        if (existing) existing.remove();

        this.elementTargetOptions = Array.from(this.elementTarget.options);
        this.init();
    }

    // Método principal que inicializa o componente
    init() {
        this.elementTarget.classList.add("multiple-select-target");

        this.multipleSelect = document.createElement("div");
        this.multipleSelect.classList.add("multiple-select");
        this.multipleSelect.setAttribute("id", `multiple-select#${this.id}`);

        this.multipleSelectHeader = document.createElement("div");
        this.multipleSelectHeader.classList.add("multiple-select__header");

        this.multipleSelectDropdown = document.createElement("div");
        this.multipleSelectDropdown.classList.add("multiple-select__dropdown");

        this.multipleSelect.append(this.multipleSelectHeader, this.multipleSelectDropdown);

        this.elementTarget.parentElement.insertBefore(this.multipleSelect, this.elementTarget.nextSibling);

        this.createOptions();

        this.multipleSelectHeader.addEventListener("click", () => {
            // Define a mesma largura do componente para o dropdown
            const dropdownWidth = this.multipleSelect.offsetWidth;
            document.documentElement.style.setProperty("--oms-dropdown-width", `${dropdownWidth}px`);

            document.documentElement.style.removeProperty("--oms-dropdown-height");
            document.documentElement.style.removeProperty("--oms-dropdown-bottom");

            const documentHeight = document.documentElement.scrollHeight;

            this.multipleSelect.toggleAttribute("open");

            const dropdownHeight = this.multipleSelectDropdown.offsetHeight;
            const headerRect = this.multipleSelectHeader.getBoundingClientRect();

            const spaceBelow = documentHeight - headerRect.bottom;
            const spaceAbove = headerRect.top;

            if (spaceBelow >= dropdownHeight) {
                // Há espaço suficiente abaixo -> abre abaixo e mantém altura padrão
                // (Nada precisa ser feito - CSS padrão posiciona abaixo)
            } else if (spaceAbove >= dropdownHeight) {
                //  Há espaço suficiente acima -> abre acima e mantém altura padrão
                document.documentElement.style.setProperty(
                    "--oms-dropdown-bottom",
                    `${this.multipleSelectHeader.clientHeight}px`
                );
            } else {
                // Não há espaço suficiente nem abaixo nem acima -> abre onde couber mais e ajusta a altura
                const openAbove = spaceAbove > spaceBelow;
                const availableSpace = openAbove ? spaceAbove : spaceBelow;

                document.documentElement.style.setProperty(
                    "--oms-dropdown-height",
                    `${availableSpace}px`
                );

                if (openAbove) {
                    document.documentElement.style.setProperty(
                        "--oms-dropdown-bottom",
                        `${this.multipleSelectHeader.clientHeight}px`
                    );
                }
            }
        });

        // TODO: adicionar evento para fechar o dropdown ao clicar fora
        document.addEventListener("click", function (e) {
        });
    }

    createOptions() {
        this.elementTargetOptions.forEach((option, index) => {
            const optionItem = document.createElement("div");
            optionItem.classList.add("oms-option");

            const optionCheckbox = document.createElement("input");
            optionCheckbox.classList.add("oms-option-checkbox");
            optionCheckbox.setAttribute("id", `oms-option-${index}`);
            optionCheckbox.setAttribute("type", "checkbox");

            const optionLabel = document.createElement("label");
            optionLabel.classList.add("oms-option-label");
            optionLabel.setAttribute("for", `oms-option-${index}`);
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
        });
    }
}