
export function foundedRangeColor(goal: any, funded: any) {
    const fundedPercentage = (Number(funded) / Number(goal)) * 100;
    if (fundedPercentage < 20) {
        return 'red';
    } else if (fundedPercentage < 50) {
        return 'yellow';
    } else if (fundedPercentage < 80) {
        return 'blue';
    } else {
        return 'green';
    }
}