export default class BudgetTracker {
    constructor(querySelectorString) {
        this.root = document.querySelector(querySelectorString);
        this.root.innerHTML = BudgetTracker.html();

        this.root.querySelector(".new-entry").addEventListener("click", () => {
            this.onNewEntryBtnClick();
        });

        // Load initial data from Local Storage
        this.load();
    }

    static html() {
        return `
            
        `;
    }

    static entryHtml() {
        return `
           
        `;
    }

    load() {
        const entries = JSON.parse(localStorage.getItem("budget-tracker-entries-dev") || "[]");

        for (const entry of entries) {
            this.addEntry(entry);
        }

        this.updateSummary();
    }

    updateSummary() {
        const total = this.getEntryRows().reduce((total, row) => {
            const amount = row.querySelector(".input-amount").value;
            const isExpense = row.querySelector(".input-type").value === "expense";
            const modifier = isExpense ? -1 : 1;

            return total + (amount * modifier);
        }, 0);

        const totalFormatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(total);

        this.root.querySelector(".total").textContent = totalFormatted;
    }

    save() {
        const data = this.getEntryRows().map(row => {
            return {
                date: row.querySelector(".input-date").value,
                description: row.querySelector(".input-description").value,
                type: row.querySelector(".input-type").value,
                amount: parseFloat(row.querySelector(".input-amount").value),
            };
        });

        localStorage.setItem("budget-tracker-entries-dev", JSON.stringify(data));
        this.updateSummary();
    }

    addEntry(entry = {}) {
        this.root.querySelector(".entries").insertAdjacentHTML("beforeend", BudgetTracker.entryHtml());

        const row = this.root.querySelector(".entries tr:last-of-type");

        row.querySelector(".input-date").value = entry.date || new Date().toISOString().replace(/T.*/, "");
        row.querySelector(".input-description").value = entry.description || "";
        row.querySelector(".input-type").value = entry.type || "income";
        row.querySelector(".input-amount").value = entry.amount || 0;
        row.querySelector(".delete-entry").addEventListener("click", e => {
            this.onDeleteEntryBtnClick(e);
        });

        row.querySelectorAll(".input").forEach(input => {
            input.addEventListener("change", () => this.save());
        });
    }

    getEntryRows() {
        return Array.from(this.root.querySelectorAll(".entries tr"));
    }

    onNewEntryBtnClick() {
        this.addEntry();
    }

    onDeleteEntryBtnClick(e) {
        e.target.closest("tr").remove();
        this.save();
    }
}