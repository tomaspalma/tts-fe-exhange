"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Input } from '../ui/input'
import { Button } from "../ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "../ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../ui/popover"
import { getCourseScheduleSigarra } from "../../api/backend"
import { ClassExchange, CourseOption } from "../../@types"

type props = {
    setCurrentDirectExchange: Dispatch<SetStateAction<Map<string, ClassExchange>>>,
    currentDirectExchange: Map<string, ClassExchange>,
    ucName: string,
    ucClass: string,
    ucCode: string,
    ucSigla: string
};

export function DirectExchangeSelection({
    setCurrentDirectExchange,
    currentDirectExchange,
    ucName,
    ucClass,
    ucCode,
    ucSigla
}: props) {
    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<string>("");
    const [selectedClass, setSelectedClass] = useState<string>("");
    const [student, setStudent] = useState<string>("");

    const [ucClasses, setUcClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log("Uc sigla: ", ucSigla);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCourseScheduleSigarra(ucCode);
                setUcClasses(data.filter((otherUcClass) => otherUcClass.tipo === "TP" && ucClass !== otherUcClass.turma_sigla).sort((a, b) => a.turma_sigla.localeCompare(b.turma_sigla))
                    .map(otherUcClass => ({ value: otherUcClass.aula_id.toString(), label: otherUcClass.turma_sigla })));

            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [ucCode]);

    if (isLoading) {
        return <p>Loading schedule...</p>;
    }

    if (error) {
        return <p>Error fetching schedule: {error.message}</p>;
    }

    console.log("Student: ", student);

    return (
        <div className="flex w-full justify-between space-x-4 items-center">
            <div className="flex flex-col space-y-2">
                <span className="font-bold">{ucName}</span>
                <div className="flex flex-row items-center">
                    <Input disabled type="text" className="w-[85px] disabled:cursor-default disabled:opacity-100 placeholder:text-black dark:placeholder:text-white" placeholder={ucClass}></Input>
                    <span>
                        <ArrowRightIcon className="mx-2 h-5 w-5"></ArrowRightIcon>
                    </span>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-[150px] justify-between"
                            >
                                {value
                                    ? ucClasses.find((ucClass) => ucClass.value === value)?.label
                                    : "Escolher turma..."}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[180px] p-0">
                            <Command>
                                <CommandInput className="border-none focus:ring-0" placeholder="Procurar turma..." />
                                <CommandEmpty>Nenhuma turma encontrada.</CommandEmpty>
                                <CommandGroup>
                                    {ucClasses.map((otherStudentUcClass) => (
                                        <CommandItem
                                            className="pl-2"
                                            key={otherStudentUcClass.value}
                                            value={otherStudentUcClass.value}
                                            onSelect={(currentValue) => {
                                                currentDirectExchange.delete(currentValue);
                                                console.log("fuck this shit as a student: ", student);
                                                setCurrentDirectExchange(
                                                    new Map(currentDirectExchange.set(otherStudentUcClass.value, {
                                                        course_unit: ucSigla,
                                                        old_class: otherStudentUcClass.label,
                                                        new_class: ucClass, // auth student class
                                                        other_student: student
                                                    }))
                                                )
                                                setSelectedClass(currentValue);
                                                setValue(currentValue === value ? "" : currentValue)
                                                setOpen(false)
                                            }}
                                        >
                                            {otherStudentUcClass.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="flex flex-col space-y-2">
                <span className="font-bold">Estudante</span>
                <Input onChange={(event) => {
                    setStudent(event.target.value);
                }} value={student} />
            </div>
        </div >
    )
}
