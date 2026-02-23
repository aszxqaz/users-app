export function parseDDMMYYYY({ value }: { value: string | undefined | null }) {
    if (typeof value == "string") {
        const parts = value.match(/(\d{2})\.(\d{2})\.(\d{4})/);

        if (parts) {
            // JavaScript Date constructor uses yyyy-mm-dd format internally
            const day = parts[1];
            const month = parts[2];
            const year = parts[3];
            const isoDateString = `${year}-${month}-${day}`;

            const date = new Date(isoDateString);
            // Check if the date is valid and parts match the input to avoid issues with invalid dates like Feb 30th
            if (date.toISOString().slice(0, 10) === isoDateString) {
                return date;
            }
        }
    }
}

export function formatToDDMMYYYY({ value }: { value: Date }) {
    let day = value.getDate();
    let month = value.getMonth() + 1;
    let year = value.getFullYear();

    return `${day < 10 ? "0" : ""}${day}.${month < 10 ? "0" : ""}${month}.${year}`;
}
