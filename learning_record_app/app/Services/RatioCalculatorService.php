<?php
namespace App\Services;

class RatioCalculatorService
{
    public function calculateRatios($data)
    {
        $hours = $data->hours;
        $minute = $data->minute;
        $ratioOb = $data->ratio;

        $totalMinute = ($hours * 60) + $minute;
        foreach($ratioOb as $categoryId => $ratio){
            $percentage = $ratio / 100;
            $ratioOb[$categoryId] = [
                'ratio' => $ratio,
                'time' => round($totalMinute * $percentage, 2),
            ];
        }
        return $ratioOb;
    }
}