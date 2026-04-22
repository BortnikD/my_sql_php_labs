<?php

readonly class ChargesStatementDto implements JsonSerializable
{
    /**
     * @param CompanyStatementDto[] $companies
     */
    public function __construct(
        public array $companies,
        public float $total_hours,
        public float $total_sum,
    )
    {
    }

    public function jsonSerialize(): mixed
    {
        return [
            'companies' => $this->companies,
            'total_hours' => $this->total_hours,
            'total_sum' => $this->total_sum,
        ];
    }
}
