import { useState, useEffect } from 'react';
import moment from 'moment';
import { firebase } from '../firebase/firebase';
import { collatedTasksExist } from '../helpers';

// [
//   {
//     archived: false,
//     projectId: 'NEXT_7',
//     task: 'This is my task',
//     id: '234234as',
//     date: '01/05/2020',
//     userId: 'asdfaslkjfasdf090asf',
//   },
//   {
//     archived: false,
//     projectId: 'INBOX',
//     task: 'Read my notes',
//     id: 'asdffad8',
//     date: '',
//     userId: 'asdfaslkjfasdf090asf',
//   },
// ]

export const useTasks = (selectedProject) => {
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [tasks, setTasks] = useState();

  useEffect(() => {
    let unsubscribe = firebase
      .firestore()
      .collection('tasks')
      .where('userId', '==', 'asdfaslkjfasdf090asf');

    console.log(unsubscribe, 'unsubscribe from hook');

    // pass in selected project and if it doesn't exist in collatedTasks
    // (e.g Inbox, Today or Next_7), run first condition of grabbing project
    // by projectId. Else, grab tasks from 'Today'. Else, grab tasks from 'Inbox'
    unsubscribe =
      selectedProject && !collatedTasksExist(selectedProject)
        ? (unsubscribe = unsubscribe.where('projectId', '==', selectedProject))
        : selectedProject === 'TODAY'
        ? (unsubscribe = unsubscribe.where(
            'date',
            '==',
            moment().format('DD/MM/YYYY')
          ))
        : selectedProject === 'INBOX' || selectedProject === 0
        ? (unsubscribe = unsubscribe.where('date', '==', ''))
        : unsubscribe;

    unsubscribe = unsubscribe.onSnapshot((snapshot) => {
      const newTasks = snapshot.docs.map((task) => ({
        id: task.id,
        ...task.data(),
      }));

      setTasks(
        selectedProject === 'NEXT_7'
          ? newTasks.filter(
              (task) =>
                moment(task.date, 'DD-MM-YYYY').diff(moment(), 'days') <= 7 &&
                task.archived !== true
            )
          : newTasks.filter((task) => task.archived !== true)
      );

      setArchivedTasks(newTasks.filter((task) => task.archived !== false));
    });

    return () => unsubscribe();
  }, [selectedProject]);

  return { tasks, archivedTasks };
};

export const useProjects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    firebase
      .firestore()
      .collection('projects')
      .where('userId', '==', 'asdfaslkjfasdf090asf')
      .orderBy('projectId') // show latest projects first
      .get()
      .then((snapshot) => {
        const allProjects = snapshot.docs.map((project) => ({
          ...project.data(),
          docId: project.id,
        }));

        // make sure projects has indeed changed, or we'll get infinite loop
        if (JSON.stringify(allProjects) !== JSON.stringify(projects)) {
          setProjects(allProjects);
        }
      });
  }, [projects]);

  console.log(projects, 'projects');

  return { projects, setProjects };
};
