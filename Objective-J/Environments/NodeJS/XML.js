global._parseXMLResolver = function()
{
    return function(aString)
    {
        console.log('parse xml');
        console.log(aString);
        return {};
    }
}
