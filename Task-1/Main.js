
let tasks = getTasks();

let members = [];

const taskForm =
    document.getElementById("taskForm");


const taskTitle =
    document.getElementById("taskTitle");


const assignedMember =
    document.getElementById("assignedMember");


const priority =
    document.getElementById("priority");


const deadline =
    document.getElementById("deadline");


const errorMessage =
    document.getElementById("errorMessage");


const taskList =
    document.getElementById("taskList");


const emptyState =
    document.getElementById("emptyState");


const searchInput =
    document.getElementById("searchInput");


const statusFilter =
    document.getElementById("statusFilter");


const priorityFilter =
    document.getElementById("priorityFilter");


const totalTasks =
    document.getElementById("totalTasks");


const completedTasks =
    document.getElementById("completedTasks");


const pendingTasks =
    document.getElementById("pendingTasks");


const loadingMessage =
    document.getElementById("loadingMessage");


async function loadMembers() {

    loadingMessage.style.display = "block";

    assignedMember.disabled = true;


    try {

        const response =
            await fetch("members.json");


        if (!response.ok) {

            throw new Error(
                "Unable to load committee members."
            );
        }


        members = await response.json();


        populateMemberDropdown();


    } catch (error) {

        console.error(
            "Member loading error:",
            error
        );


        assignedMember.innerHTML =
            `<option value="">
                Failed to load members
            </option>`;


        errorMessage.textContent =
            "Unable to load committee members. Please check the JSON file.";

    } finally {

        loadingMessage.style.display = "none";

        assignedMember.disabled = false;
    }
}


function populateMemberDropdown() {

    assignedMember.innerHTML =
        `<option value="">
            Select Member
        </option>`;


    members.forEach(member => {

        const option =
            document.createElement("option");


        option.value =
            member.name;


        option.textContent =
            member.name;


        assignedMember.appendChild(option);
    });
}


function validateForm() {

    const title =
        taskTitle.value.trim();


    const member =
        assignedMember.value;


    const selectedPriority =
        priority.value;


    const selectedDeadline =
        deadline.value;


    if (!title) {

        return "Task title cannot be empty.";
    }


    if (!member) {

        return "Please select an assigned member.";
    }


    if (!selectedPriority) {

        return "Please select a priority.";
    }


    if (!selectedDeadline) {

        return "Please select a deadline.";
    }


    return "";
}


taskForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        errorMessage.textContent = "";


        const error =
            validateForm();


        if (error) {

            errorMessage.textContent =
                error;

            return;
        }


        const newTask =
            createTask(
                taskTitle.value.trim(),
                assignedMember.value,
                priority.value,
                deadline.value
            );


        tasks =
            addTask(
                tasks,
                newTask
            );


        saveTasks(tasks);


        taskForm.reset();


        renderTasks();


        updateStatistics();
    }
);

function renderTasks() {

    const searchText =
        searchInput.value;


    const selectedStatus =
        statusFilter.value;


    const selectedPriority =
        priorityFilter.value;


    let filteredTasks =
        searchTasks(
            tasks,
            searchText
        );


    filteredTasks =
        filterTasks(
            filteredTasks,
            selectedStatus,
            selectedPriority
        );


    taskList.innerHTML = "";


    if (filteredTasks.length === 0) {

        emptyState.style.display = "block";

        return;
    }


    emptyState.style.display = "none";


    filteredTasks.forEach(task => {

        const taskCard =
            createTaskCard(task);


        taskList.appendChild(taskCard);
    });
}

function createTaskCard(task) {

    const card =
        document.createElement("div");


    card.className =
        "task-card";


    if (task.status === "Completed") {

        card.classList.add("completed");
    }


    const priorityClass =
        `priority-${task.priority.toLowerCase()}`;


    const statusClass =
        task.status === "Completed"
            ? "status-completed"
            : "status-pending";


    const formattedDate =
        formatDate(task.deadline);


    card.innerHTML = `

        <div class="task-top">

            <h3 class="task-title">
                ${escapeHTML(task.title)}
            </h3>

            <span class="status ${statusClass}">
                ${task.status}
            </span>

        </div>


        <div class="task-details">

            <span class="detail">
                ${escapeHTML(task.assignedMember)}
            </span>

            <span class="detail priority ${priorityClass}">
                ${task.priority}
            </span>

            <span class="detail">
                ${formattedDate}
            </span>

        </div>


        <div class="task-actions">

            <button
                class="complete-btn ${
                    task.status === "Completed"
                        ? "undo"
                        : ""
                }"
                data-action="complete"
                data-id="${task.id}"
            >
                ${
                    task.status === "Completed"
                        ? "Mark Pending"
                        : "Complete"
                }
            </button>


            <button
                class="delete-btn"
                data-action="delete"
                data-id="${task.id}"
            >
                🗑 Delete
            </button>

        </div>
    `;


    return card;
}

taskList.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest("button");


        if (!button) {
            return;
        }


        const id =
            Number(button.dataset.id);


        const action =
            button.dataset.action;


        if (action === "complete") {

            tasks =
                toggleTaskStatus(
                    tasks,
                    id
                );


            saveTasks(tasks);

            renderTasks();

            updateStatistics();
        }


        if (action === "delete") {

            tasks =
                deleteTask(
                    tasks,
                    id
                );


            saveTasks(tasks);

            renderTasks();

            updateStatistics();
        }
    }
);

searchInput.addEventListener(
    "input",
    function() {

        renderTasks();
    }
);

statusFilter.addEventListener(
    "change",
    function() {

        renderTasks();
    }
);

priorityFilter.addEventListener(
    "change",
    function() {

        renderTasks();
    }
);

function updateStatistics() {

    const statistics =
        getStatistics(tasks);


    totalTasks.textContent =
        statistics.total;


    completedTasks.textContent =
        statistics.completed;


    pendingTasks.textContent =
        statistics.pending;
}

function formatDate(dateString) {

    const date =
        new Date(dateString);


    if (isNaN(date.getTime())) {

        return dateString;
    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent = text;


    return div.innerHTML;
}

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        updateStatistics();

        renderTasks();

        await loadMembers();
    }
);