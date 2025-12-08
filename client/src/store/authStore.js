import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { signin, signup, checkauth, signout } from "../api/authAPI";

export const useAuthStore = create(
    persist(
        devtools((set) => ({
            user: null,
            isLoading: false,
            error: null,

            signin: async (username, password) => {
                set({ isLoading: true, error: null });
                try {
                    localStorage.removeItem("auth-storage");
                    const { data } = await signin(username, password);
                    set({ user: data, isLoading: false, error: null });
                } catch (error) {
                    set({
                        error:
                            error.response?.data?.message ||
                            "Błąd podczas logowania",
                        isLoading: false,
                    });
                    throw error;
                }
            },

            signup: async (username, link, password) => {
                set({ isLoading: true, error: null });
                try {
                    const { data } = await signup(username, link, password);
                    set({ user: data, isLoading: false, error: null });
                } catch (error) {
                    set({
                        error:
                            error.response?.data?.message ||
                            "Błąd podczas rejestracji",
                        isLoading: false,
                    });
                    throw error;
                }
            },

            logout: async () => {
                try {
                    await signout();
                } catch (error) {
                    console.error("Logout error:", error);
                }
                set({ user: null, error: null });
                localStorage.removeItem("auth-storage");
            },

            checkAuth: async () => {
                try {
                    const response = await checkauth();
                    if (response) {
                        set({ user: response, error: null });
                    } else {
                        set({ user: null, error: null });
                        localStorage.removeItem("auth-storage");
                    }
                } catch {
                    set({ user: null });
                    localStorage.removeItem("auth-storage");
                }
            },

            isAuthenticated: () => !!useAuthStore.getState().user,

            isAdminOrModerator: () => {
                const user = useAuthStore.getState().user;
                return (
                    user && (user.role === "admin" || user.role === "moderator")
                );
            },
        })),
        {
            name: "auth-storage",
            partialize: (state) => ({ user: state.user }),
        }
    )
);

