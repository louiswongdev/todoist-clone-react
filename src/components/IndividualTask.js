import React, { useState } from 'react';
import { firebase } from '../firebase/firebase';

import { Checkbox } from './Checkbox';
import { FaTrashAlt } from 'react-icons/fa';

export const IndividualTask = ({ task, tasks }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const deleteTask = (taskId) => {
    const newTasks = tasks.filter((task) => task.id !== taskId);
    console.log('newTasks: ', newTasks);
    tasks = [...newTasks];
    console.log('tasks: ', tasks);

    firebase.firestore().collection('tasks').doc(taskId).delete().then();
  };

  return (
    <>
      <li>
        <Checkbox id={task.id} />
        <span>{task.task}</span>
        <span
          className="task__delete"
          data-testid="delete-project"
          onClick={() => setShowConfirm(!showConfirm)}
        >
          <FaTrashAlt />
          {showConfirm && (
            <div className="project-delete-modal">
              <div className="project-delete-modal__inner">
                <p>Are you sure you want to delete this task?</p>
                <div className="delete-btn-group">
                  <button type="button" onClick={() => deleteTask(task.id)}>
                    Delete
                  </button>
                  <span
                    onClick={() => setShowConfirm(!showConfirm)}
                    onKeyDown={() => setShowConfirm(!showConfirm)}
                    tabIndex={0}
                    role="button"
                    aria-label="Cancel adding project, do not delete"
                  >
                    Cancel
                  </span>
                </div>
              </div>
            </div>
          )}
        </span>
      </li>
    </>
  );
};
