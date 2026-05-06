<?php

class FilterChain
{
    private int $index = 0;

    /**
     * @param Filter[] $filters
     */
    public function __construct(
        private readonly array   $filters,
        private readonly Closure $finalHandler,
    )
    {
    }

    public function next(Request $request): void
    {
        if ($this->index < count($this->filters)) {
            $filter = $this->filters[$this->index++];
            $filter->doFilter($request, $this);
        } else {
            ($this->finalHandler)($request);
        }
    }
}
