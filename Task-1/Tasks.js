
function createTask(
    title,
    assignedMember,
    priority,
    deadline
) {

    return {

        id: Date.now(),

        title: title,

        assignedMember: assignedMember,

        priority: priority,

        deadline: deadline,

        status: "Pending"
    };
}

function addTask(tasks, task) {

    tasks.push(task);

    return tasks;
}

function toggleTaskStatus(tasks, id) {

    return tasks.map(task => {

        if (task.id === id) {

            return {
                ...task,

                status:
                    task.status === "Pending"
                        ? "Completed"
                        : "Pending"
            };
        }

        return task;
    });
}

function deleteTask(tasks, id) {

    return tasks.filter(
        task => task.id !== id
    );
}

function searchTasks(tasks, searchText) {

    const text =
        searchText
            .trim()
            .toLowerCase();


    if (!text) {
        return tasks;
    }


    return tasks.filter(task =>
        task.title
            .toLowerCase()
            .includes(text)
    );
}

function filterTasks(
    tasks,
    status,
    priority
) {

    return tasks.filter(task => {

        const statusMatch =
            status === "All" ||
            task.status === status;


        const priorityMatch =
            priority === "All" ||
            task.priority === priority;


        return statusMatch && priorityMatch;
    });
}

function getStatistics(tasks) {

    const total = tasks.length;


    const completed =
        tasks.filter(
            task => task.status === "Completed"
        ).length;


    const pending =
        tasks.filter(
            task => task.status === "Pending"
        ).length;


    return {
        total,
        completed,
        pending
    };
}