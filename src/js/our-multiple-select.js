class OurMultipleSelect {
    constructor(id) {
        this.id = id;
        this.elementTarget = document.getElementById(id);

        if (!this.elementTarget) {
            throw new Error(`Elemento com ID "${id}" não encontrado.`);
        }

        // Remove instância anterior caso existir
        const existing = document.getElementById(`oms-multiple-select#${id}`);
        if (existing) existing.remove();

        this.elementTargetOptions = Array.from(this.elementTarget.options);
        this.init();
    }

    // Método principal que inicializa o componente
    init() {
        this.elementTarget.classList.add("oms-multiple-select__target");

        this.multipleSelect = document.createElement("div");
        this.multipleSelect.classList.add("oms-multiple-select");
        this.multipleSelect.setAttribute("id", `oms-multiple-select#${this.id}`);

        this.multipleSelectHeader = document.createElement("div");
        this.multipleSelectHeader.classList.add("oms-multiple-select__header");

        this.multipleSelectDropdown = document.createElement("div");
        this.multipleSelectDropdown.classList.add("oms-multiple-select__dropdown");

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

            const gutterPixels = omsConvertRemToPixels(getComputedStyle(document.documentElement).getPropertyValue("--oms-gutter-0"));

            if (spaceBelow >= dropdownHeight + gutterPixels) {
                // Há espaço suficiente abaixo -> abre abaixo e mantém altura padrão
                // (Nada precisa ser feito - CSS padrão posiciona abaixo)
            } else if (spaceAbove >= dropdownHeight) {
                //  Há espaço suficiente acima -> abre acima e mantém altura padrão
                const bottom = this.multipleSelectHeader.clientHeight + gutterPixels;

                document.documentElement.style.setProperty(
                    "--oms-dropdown-bottom",
                    `${bottom}px`
                );
            } else {
                // Não há espaço suficiente nem abaixo nem acima -> abre onde couber mais e ajusta a altura
                const openAbove = spaceAbove > spaceBelow;
                const availableSpace = openAbove ? spaceAbove : spaceBelow;

                document.documentElement.style.setProperty(
                    "--oms-dropdown-height",
                    `${availableSpace - (2 * gutterPixels)}px`
                );

                if (openAbove) {
                    const bottom = this.multipleSelectHeader.clientHeight - gutterPixels;

                    document.documentElement.style.setProperty(
                        "--oms-dropdown-bottom",
                        `${bottom}px`
                    );
                }
            }
        });

        document.addEventListener("click", (e) => {
            if (!this.multipleSelect.contains(e.target) && this.multipleSelect.getAttribute("open") !== null) {
                this.multipleSelect.removeAttribute("open");
            }
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
            optionCheckbox.setAttribute("value", option.value);

            const optionLabel = document.createElement("label");
            optionLabel.classList.add("oms-option-label");
            optionLabel.setAttribute("for", `oms-option-${index}`);
            optionLabel.textContent = option.text;

            optionItem.append(optionCheckbox, optionLabel);

            this.multipleSelectDropdown.append(optionItem);

            optionItem.addEventListener("change", () => this.updateHeader());
        });

        this.multipleSelect.options = this.multipleSelect.querySelectorAll("[type=checkbox]");
    }

    updateHeader() {
        const selected = Array.from(
            this.multipleSelect.querySelectorAll("[type=checkbox]:checked")
        ).map((checkbox) => checkbox.nextElementSibling.textContent);

        this.multipleSelectHeader.innerHTML = selected.length >= 3
            ? `<span>${selected.length} selecionados(as)</span>`
            : `<span>${selected.join(", ")}</span>`;
    }

    getValues() {
        const selected = Array.from(
            this.multipleSelect.querySelectorAll("[type=checkbox]:checked")
        ).map((checkbox) => checkbox.value);

        return selected.length ? selected : null;
    }

    setValues(values) {
        if (!Array.isArray(values)) return;

        this.multipleSelect.options.forEach((checkbox) => {
            checkbox.checked = values.includes(checkbox.value);
        });

        this.updateHeader();
    }

    clear() {
        this.setValues([]);
    }
}

function omsConvertRemToPixels(rem) {
    return parseFloat(rem) * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

const example = new OurMultipleSelect("example");