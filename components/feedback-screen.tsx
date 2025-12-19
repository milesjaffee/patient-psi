   interface FeedbackItems {
        effectiveness: number;
        patientSatisfaction: number;
        sensitivity: number;
        questionQuality: number;
        resolutionLevel: number;
        empowerment: number;
        startingDistress: number;
        whatWorkedWell: string;
        areasForImprovement: string;
        culturalConsiderations: string;
        actionItems: string;
    }
export function FeedbackScreen({data}: {data: FeedbackItems}) {

    try {
        // Remove leading/trailing whitespace and newlines
        const feedback = data;

        //console.log(feedback);
        //console.log(feedback.patientSatisfaction);

        return (
            <div className=" flex flex-row gap-2">
                <div className="flex-col gap-2">
                    <div className={"flex flex-row gap-2"}>
                        <FeedbackItem color="to-blue-300" name="Effectiveness" message={feedback.effectiveness}/>
                        <FeedbackItem color="to-purple-300" name="Patient Satisfaction" message={feedback.patientSatisfaction}/>
                        <FeedbackItem color="to-red-300" name="Sensitivity" message={feedback.sensitivity}/>
                        <FeedbackItem color="to-green-300" name="Question Quality" message={feedback.questionQuality}/>
                    </div>
                    <div className={"flex flex-row gap-2 space-between"}>
                        <FeedbackItem color="to-gray-300" name="Resolution Level" message={feedback.resolutionLevel}/>
                        <FeedbackItem color="to-gray-300" name="Starting Distress" message={feedback.startingDistress}/>
                        <FeedbackItem color="to-gray-300" name="Empowerment" message={feedback.empowerment}/>
                    </div>
                    <FeedbackString color="to-blue-300" message={feedback.actionItems} name="Action Items"/>
                </div>
                <div className={"flex flex-col gap-2"}>
                    <FeedbackString color="to-green-300" name="What Worked Well?" message={feedback.whatWorkedWell}/>
                    <FeedbackString color="to-red-300" name="Areas for Improvement" message={feedback.areasForImprovement}/>
                    <FeedbackString color="to-purple-300" name="Cultural Considerations" message={feedback.culturalConsiderations}/>
                </div>
            </div>
        )
    } catch (error) {
        console.error('Error parsing AI feedback, try again:', error);
        return <div>"Error parsing AI feedback, try again!"</div>
    }

    function FeedbackItem ({color, name, message}: {color: string, name: string, message: string|number}) {
        return (
            <div className={
                `mt-2 flex-col p-3 justify-end text-center max-w-[145px] min-w-[125px] min-h-[60px] rounded-md justify-center text-${color} bg-gradient-to-b border-2 from-white ${color} `
            }>
            
                <div className="text-3xl font-bold">{message}/10</div>
                <div className="text-lg font-italic">{name}</div>
            </div>
        )
    }
    function FeedbackString ({color, name, message}: {color: string, name: string, message: string}) {
        return (
            <div className={
                `mt-2 flex-col p-3 justify-end text-center max-w-[580px] min-h-[60px] rounded-md justify-center text-${color} bg-gradient-to-b border-2 from-white ${color} `
            }>
            
                <div className="text-2xl font-bold">{name}</div>
                <div className="text-lg font-italic">{message}</div>
            </div>
        )
    }
}