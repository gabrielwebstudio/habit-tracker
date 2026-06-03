import { isSameDay } from "date-fns";
import { createContext, useContext, type ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocationStorage";

export type Habit = {
    id: string
    name: string
    completions: Date[]
}

type Context = {
    habits: Habit[]
    addHabit: (name: string) => void
    deleteHabit: (id: string) => void
    toggleHabit: (id: string, date: Date) => void
}

type HabitProviderProps = {
    children: ReactNode
}

export const HabitContext = createContext<null | Context>(null)

export function HabitProvider({ children }: HabitProviderProps) {
    const [habits, setHabits] = useLocalStorage<Habit[]>("habits",[]);
    console.log("habits from context", habits)


    function addHabit(name: string) {
        setHabits(curr => [...curr, { id: crypto.randomUUID(), name, completions: [] }])
    }

    function deleteHabit(id: string) {
        setHabits(curr => curr.filter(h => h.id !== id))
    }

    // Förstå dig på denna logik!
    function toggleHabit(id: string, date: Date) {
        setHabits(curr => (
            curr.map(h => {
                if (h.id !== id) return h

                const aldreadyDone = h.completions.some(c => isSameDay(c, date))
                const completions = aldreadyDone
                    ? h.completions.filter(c => !isSameDay(c, date))
                    : [...h.completions, date]

                return { ...h, completions }
            })
        ))
    }

    return (
        <HabitContext value={{ habits, addHabit, deleteHabit, toggleHabit }}>
            {children}
        </HabitContext>
    )
}

export function useHabits() {
    const habits = useContext(HabitContext);

    if (habits == null) throw new Error("Null context");

    return habits;
}