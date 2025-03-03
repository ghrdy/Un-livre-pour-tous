import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project } from '@/lib/api/projects';

interface ProjectState {
  activeProject: Project | null;
  setActiveProject: (project: Project) => void;
  clearActiveProject: () => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      activeProject: null,
      setActiveProject: (project) => set({ activeProject: project }),
      clearActiveProject: () => set({ activeProject: null }),
    }),
    {
      name: 'project-storage',
      partialize: (state) => ({
        activeProject: state.activeProject,
      }),
    }
  )
);