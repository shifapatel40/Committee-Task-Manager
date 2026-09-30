const STORAGE_KEY = "committeeTasks";

function saveTasks(tasks) {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(tasks)
        );

        return true;

    } catch (error) {

        console.error(
            "Error saving tasks:",
            error
        );

        return false;
    }
}

function getTasks() {

    try {

        const storedTasks =
            localStorage.getItem(STORAGE_KEY);


        if (!storedTasks) {
            return [];
        }


        return JSON.parse(storedTasks);

    } catch (error) {

        console.error(
            "Error retrieving tasks:",
            error
        );

        return [];
    }
}