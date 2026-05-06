<?php

interface Filter
{
    public function doFilter(Request $request, FilterChain $chain): void;
}
