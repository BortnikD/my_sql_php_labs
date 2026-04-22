<?php

readonly class CompanyStatementDto implements JsonSerializable
{
    /**
     * @param ChargeRowDto[] $charges
     */
    public function __construct(
        public string $company_name,
        public array  $charges,
        public float  $total_hours,
        public float  $total_sum,
    )
    {
    }

    public function jsonSerialize(): mixed
    {
        return [
            'company_name' => $this->company_name,
            'charges' => $this->charges,
            'total_hours' => $this->total_hours,
            'total_sum' => $this->total_sum,
        ];
    }
}
