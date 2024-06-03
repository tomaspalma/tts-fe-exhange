import { CheckCircleIcon, InfoIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { MarketplaceExchangeDetail } from "./MarketplaceExchangeDetail";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { SubmitDirectExchangeForm } from "../SubmitDirectExchangeForm";
import { useContext, useState } from "react";
import { ClassExchange, CourseOption } from "../../../@types";
import { getClassScheduleSigarra } from "../../../api/backend";
import { convertSigarraCoursesToTtsCourses } from "../../../utils/utils";
import { StudentScheduleContext } from "../../../contexts/StudentScheduleContext";

export const MarketplaceExchange = ({ exchange, studentData }) => {
    const [open, setOpen] = useState<boolean>(false);
    const { setCourseOptions, courseOptions } = useContext(StudentScheduleContext);
    const [previewingSchedule, setPreviewingSchedule] = useState<boolean>(false);
    const [storedSchedule, setStoredSchedule] = useState<CourseOption[]>(courseOptions);

    console.log("Student data: ", studentData);

    const currentDirectExchange: Map<string, ClassExchange> = (() => {
        const exchangesMap = new Map();

        for (const classExchange of exchange.class_exchanges) {
            console.log("class exchange is: ", classExchange);
            exchangesMap.set(classExchange.course_unit, {
                course_unit: classExchange.course_unit,
                course_unit_id: classExchange.course_unit_id,
                new_class: classExchange.old_class,
                old_class: classExchange.new_class,
                other_student: exchange.issuer.codigo
            })
        }

        return exchangesMap;
    })();

    const previewSchedule = async () => {
        setPreviewingSchedule(true);
        for (const classExchange of exchange.class_exchanges) {
            const schedule = await getClassScheduleSigarra(classExchange.course_unit_id, classExchange.old_class);
            setCourseOptions((prev) => ([
                ...(prev.filter(schedule => schedule.course.info.acronym !== classExchange.course_unit_acronym)),
                ...convertSigarraCoursesToTtsCourses(schedule),
            ]));

        }
    }

    const restoreSchedule = async () => {
        setPreviewingSchedule(false);
        setCourseOptions(storedSchedule);
    }

    return <article className="border-2 border-gray-200 shadow-sm bg-white p-4 rounded-md w-full">
        <h3 className="font-bold text-lg text-center">{studentData.codigo}</h3>
        {exchange.class_exchanges.map((exchangeDetail) => (
            <MarketplaceExchangeDetail key={exchangeDetail.course_unit} exchangeDetail={exchangeDetail} />
        ))}
        <div className="flex flex-row items-center space-x-2 mt-4">
            {previewingSchedule
                ? <Button variant="info" className="" onClick={restoreSchedule}>
                    <InformationCircleIcon className="h-5 w-5 mr-2"></InformationCircleIcon>
                    Restaurar horário
                </Button>

                : <Button variant="info" className="" onClick={async () => { await previewSchedule() }}>
                    <InformationCircleIcon className="h-5 w-5 mr-2"></InformationCircleIcon>
                    Prever horário
                </Button>
            }
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="submit"
                        className="w-full"
                    >
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        Trocar
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-center">Confirmação de sumbissão de troca direta</DialogTitle>
                        <DialogDescription className="text-center">
                            Após a submissão, tanto tu como o estudante com o qual especificaste na troca terão de clicar num link de confirmação para que a
                            troca se efetue de facto.
                        </DialogDescription>
                        <SubmitDirectExchangeForm currentDirectExchange={currentDirectExchange} dialogAction={setOpen} />
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    </article>
};
