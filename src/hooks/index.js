import { useState, useEffect } from 'react';
import moment from 'moment';
import { firebase } from '../firebase/firebase';
import { collatedTasksExist } from '../helpers';

export const useTasks = (selectedProject) => {
  const [tasks, setTasks] = useState([]);
  const [archivedTasks, setArchivedTasks] = useState([]);

  useEffect(() => {
    let unsubscribe = firebase
      .firestore()
      .collection('tasks')
      .where('userId', '==', 'asdfaslkjfasdf090asf');

    // console.log(unsubscribe, 'unsubscribe from hook');

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
            moment().format('DD/MM/YYY')
          ))
        : selectedProject === 'INBOX' || selectedProject === 0
        ? (unsubscribe = unsubscribe.where('date', '==', ''))
        : unsubscribe;

    unsubscribe = unsubscribe.onSnapshot((onSnapshot) => {
      const newTasks = onSnapshot.docs.map((task) => ({
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

  return { projects, setProjects };
};
